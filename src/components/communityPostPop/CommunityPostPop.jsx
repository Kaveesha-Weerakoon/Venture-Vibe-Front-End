import React, { useEffect, useState } from 'react';
import './CommunityPostPop.scss';
import noAvatar from '../../assets/noavatar.jpg';
import { format } from 'date-fns';
import newRequest from '../../services/NewRequst';
import { GetCurrentUserC } from './../../services/user/GetCurrentUserC';

const CommunityPostPop = ({ onClose, data1, user }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [like, setLike] = useState(false);

  useEffect(() => {
    newRequest
      .get(`comments/${data1.postId}`)
      .then((response) => {
        setComments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error!', error);
        setError('There was an error fetching the posts.');
        setLoading(false);
      });
  }, [data1.postId]);

  useEffect(() => {
    // Check if the user already liked the post
    newRequest
      .get(`likes/${data1.postId}/${GetCurrentUserC().sub}`)
      .then((response) => {
        setLike(response.data.liked);
      })
      .catch((error) => {
        console.error('There was an error checking the like status!', error);
      });
  }, [data1.postId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleClick = (e) => {
    e.stopPropagation();
  };

  const formattedDate = format(new Date(data1.createdAt), 'yyyy-MM-dd');

  const userId = GetCurrentUserC().sub;

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    const commentData = {
      comment: commentContent,
      post: {
        id: data1.postId,
      },
      usercommented: {
        id: userId,
      },
    };

    try {
      const response = await newRequest.post('comments', commentData);
      setResponseMessage('Comment created successfully');
      console.log('Success:', response.data);
      // Add new comment to comments state
      setComments([...comments, response.data]);
      setCommentContent(''); // Clear the comment input
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('Failed to create comment');
    }
  };

  const handleLikeSubmit = async (event) => {
    event.preventDefault();

    const likeData = {
      post: {
        id: data1.postId,
      },
      traveler: {
        id: userId,
      },
    };

    try {
      const response = await newRequest.post('likes', likeData);
      setResponseMessage('Like created successfully');
      console.log('Success:', response.data);
      setLike(true);
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('Failed to create like');
    }
  };

  const handleUnLikeSubmit = async (event) => {
    event.preventDefault();

    try {
      await newRequest.delete(`likes/${data1.postId}/${userId}`);
      setResponseMessage('Like deleted successfully');
      console.log('Like deleted successfully');
      setLike(false);
    } catch (error) {
      setError('There was an error deleting the like.');
      console.error('Error deleting like:', error);
    }
  };

  console.log(data1.postId);
  console.log(user.id);

  return (
    <div className='CommunityPostPop' onClick={handleClick}>
      <div className="img-container">
        <img className='image' src={data1.imageSrc} alt="" />
      </div>
      <div className="content">
        <div className="top">
          <img src={user.profileImg ? user.profileImg : noAvatar} alt="" />
          <div className="details">
            <h4>{user.name}</h4>
            <p>{formattedDate}</p>
          </div>
          {!isPopupVisible ? (
            <i className="fa-solid fa-ellipsis" onClick={togglePopup}></i>
          ) : (
            <div className="report">
              <i className="fa-solid fa-times" onClick={togglePopup}></i>
              <span onClick={togglePopup}>Report</span>
            </div>
          )}
          <i className="fa-regular fa-circle-xmark" onClick={onClose}></i>
        </div>
        <p className="p">
          {data1.description}
        </p>
        <div className="like-comment-count">
          <span>{data1.likes} likes</span>
          <span>{data1.comments} comments</span>
        </div>
        <hr />
        <div className="react">
          <div className="cont">
            {like ? (
              <i className="fa-solid fa-heart" onClick={handleUnLikeSubmit}></i>
            ) : (
              <i className="fa-regular fa-heart" onClick={handleLikeSubmit}></i>
            )}
            <p>Like</p>
          </div>
          <div className="cont">
            <i className="fa-regular fa-comment"></i>
            <p>Comment</p>
          </div>
        </div>
        <div className="addcomment">
          <div className="cont">
            <img src={user.profileImg ? user.profileImg : noAvatar} alt="" />
            <div className="comment-details">
              <input
                type="text"
                placeholder='Add a Comment'
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <div className="down">
                <i className="fa-regular fa-paper-plane" onClick={handleCommentSubmit}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="comments">
          {comments.map((com, index) => (
            <div className="cont" key={index}>
              <img src={com.usercommented.profileImg ? com.usercommented.profileImg : noAvatar} alt="" />
              <div className="comment-details">
                <h5>{com.usercommented.name}</h5>
                <p>{com.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPostPop;
