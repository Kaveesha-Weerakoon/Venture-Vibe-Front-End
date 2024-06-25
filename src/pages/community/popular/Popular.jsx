import React from 'react'
import CommunityPostPage from '../../../components/communityPostPage/CommunityPostPage';
import { posts } from '../../../dummyData';

const Popular = () => {
  const limitedPost =  posts.slice(7, 9);

  return (
    <div>
       <CommunityPostPage posts={limitedPost}/>
    </div>
  )
}

export default Popular
