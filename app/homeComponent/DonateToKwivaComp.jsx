'use client'

import Link from "next/link"

const DonateToKwivaComp = () => {

    const shareContent = () => {

        if (navigator.share) {
            navigator.share({
                title: "Donate To Kwiva 🖤",
                text: "Kwiva is stalling🥶!, we need your help to keep us going and reach more audience. Kindly donate any token you can spare and we'll appreciate it immensely. Thanks🙏.",
                url: "https://kwiva.online/donate",
            })
                .then(() => console.log('Share successful'))
                .catch((error) => console.error('Error sharing:', error));
        } else {
            alert("Sharing is not supported in this browser.");
        }
    }

    return (
        <div className="donateToKwivaGrandCntn">
            <div className="donateToKwiva">
                <div className="donationDetails">
                    <h2>Donate To Kwiva 🖤</h2>
                    <p>Kwiva is stalling🥶!, we need your help to keep us going and reach more audience. Kindly donate any token you can spare and we'll appreciate it immensely. Thanks🙏.</p>
                </div>
                <div className="donationCTAs">
                    <Link href={"/donate"}>Donate <i className="icofont-love"></i></Link>
                    <button type="button" title="share" onClick={shareContent}><i className="icofont-share"></i></button>
                </div>
            </div>
        </div>
    )
}

export default DonateToKwivaComp
