import ArticleEditor from "./StoryEditor";

const Page = () => {

    return (
        <div className='dashmainCntn special new_blog'>
            <h1 className="textEditorHeader">Write A New Blog</h1>
            <ArticleEditor></ArticleEditor>
        </div>
    )
}

export default Page