'use client'
import { useEffect, useState } from "react";
import { archiveMonthlyLeaderboard } from "../utilFunctions";


const SetMonthlyWinners = () => {
    const [monthlyWinnersStatus, setMonthlyWinnersStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleMonthlyWinnerProcess = async () => {
        const today = new Date();
        const date = today.getDate();
        const withinDateRange = date >= 25 && date <= 31;
        if (!withinDateRange) return;
        try {
            setLoading(true)
            const processResult = await archiveMonthlyLeaderboard();
            setMonthlyWinnersStatus(processResult);
            setLoading(false)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <section className='monthlyWinnersFunctionCntn'>
            <h2>Set New Monthly Winners</h2>
            <div className="monthlyWinnersDetail">
                {
                    monthlyWinnersStatus?.success ? (
                        <>
                            {monthlyWinnersStatus?.message && (<p><strong>{monthlyWinnersStatus?.message}</strong>.</p>)}
                            {monthlyWinnersStatus?.top10SavedAs && (<p> Winners for <strong>{monthlyWinnersStatus?.top10SavedAs}</strong> has been set and saved as: <strong>{monthlyWinnersStatus?.top10SavedAs}</strong>.</p>)}
                            {monthlyWinnersStatus?.updatedDocs && (<p><strong>{monthlyWinnersStatus?.updatedDocs}</strong> documents were updated.</p>)}
                        </>
                    ) : (
                        <>
                            {monthlyWinnersStatus?.message && (<p><strong>{monthlyWinnersStatus?.message}</strong>.</p>)}
                            {monthlyWinnersStatus?.error && (<p><strong>Error Message:</strong> <strong id="errorMsg">{monthlyWinnersStatus?.error}</strong>.</p>)}
                        </>
                    )
                }
                {
                    loading && (
                        <p>Processing & setting current month Winners <i className="icofont-spinner-alt-2"></i></p>
                    )
                }
            </div>
            <button type="button" name="Monthly-Winner-Setter Button" onClick={handleMonthlyWinnerProcess}>{loading? "Updating..." : "Update Winners"}</button>
        </section>
    )
}

export default SetMonthlyWinners
