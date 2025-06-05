import React from 'react'
import { notFound } from 'next/navigation'
import EditStoryPage from './Editor';

const Page = ({ params }) => {
  const contentId = params.story_id; // this will be 's_1'

  if (!contentId) {
    notFound();
  }

  return (
    <div className='dashmainCntn special stories'>
        <h1 className="textEditorHeader">Edit Blogpost</h1>
        <EditStoryPage cId={contentId}></EditStoryPage>
    </div>
  )
}

export default Page
