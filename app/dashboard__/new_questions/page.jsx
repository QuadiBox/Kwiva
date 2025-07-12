import Link from "next/link";
import NewQuestionPage from "./NewQuizEditor";

const Page = () => {

    return (
        <div className='dashmainCntn  new_questions'>
            <h1 className="textEditorHeader">Add New Questions</h1>
            <NewQuestionPage></NewQuestionPage>
        </div>
    )
}

export default Page