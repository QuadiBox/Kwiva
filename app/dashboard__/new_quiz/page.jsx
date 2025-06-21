import Link from "next/link";
import NewQuizPage from "./NewQuizEditor";
// import { useUser } from "@clerk/nextjs";

const Page = () => {

    return (
        <div className='dashmainCntn special new_quiz'>
            <h1 className="textEditorHeader">Add a New Quiz</h1>
            <NewQuizPage></NewQuizPage>
        </div>
    )
}

export default Page