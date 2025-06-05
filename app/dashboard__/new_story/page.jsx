import Link from "next/link";
import ArticleEditor from "./StoryEditor";
// import { useUser } from "@clerk/nextjs";

const Page = () => {

    return (
        <div className='dashmainCntn special new_story'>
            <h1 className="textEditorHeader">Write A New Story</h1>
            <ArticleEditor></ArticleEditor>
        </div>
    )
}

export default Page