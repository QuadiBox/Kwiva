import React from 'react'
import Challenge from './Challenge'
import SetMonthlyWinners from './SetMonthlyWinners'

const Page = () => {
    return (
        <div className='dashmainCntn functions'>
            <h1 className="textEditorHeader">Functions</h1>
            <div className="theFunctionCntn">
                <SetMonthlyWinners></SetMonthlyWinners>
                <Challenge></Challenge>

            </div>
        </div>
    )
}

export default Page
