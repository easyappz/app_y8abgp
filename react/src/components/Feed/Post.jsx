import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toggleLike, getComments, addComment } from '../../api/interactions';
import { deletePost } from '../../api/posts';

const Post = ({ post, onPostDeleted }) => {
  const [isLiked, setIsLiked] = useState(false); // API doesn't provide is_liked initial state reliably in list usually without spec check. Assuming false or calculated.
  // Actually spec for post list items: likes_count, comments_count. Doesn't say "liked_by_me". We handle toggle logic mainly.
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const handleLike = async () => {
    try {
      const response = await toggleLike(post.id);
      setIsLiked(response.data.liked);
      setLikesCount(response.data.likes_count);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleToggleComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      try {
        const response = await getComments(post.id);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await addComment(post.id, { content: newComment });
      setComments([...comments, { 
        ...response.data, 
        author: { username: 'Я' } // API response for comment create is {id, content, created_at}. Author is missing in create response spec? Checking spec.
        // Spec says: response 201 content: {id, content, created_at}. Author not returned. We improvise.
      }]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="post-card" data-easytag="id1-react/src/components/Feed/Post.jsx">
      <div className="post-header">
        <div>
          <Link to={`/profile/${post.author?.id}`} className="post-author">
            {post.author?.username || 'Unknown'}
          </Link>
          <div className="post-date">{formatTime(post.created_at)}</div>
        </div>
        {/* Optional: Delete button if own post. Checking author logic not available easily without user context. skipping for now */}
      </div>

      <div className="post-content">
        {post.content}
      </div>

      <div className="post-stats">
        <span>{likesCount} Нравится</span>
        <span onClick={handleToggleComments} style={{cursor: 'pointer'}}>
          {post.comments_count !== undefined ? post.comments_count : comments.length} Комментариев
        </span>
      </div>

      <div className="post-actions">
        <button 
          className={`action-btn ${isLiked ? 'liked' : ''}`} 
          onClick={handleLike}
        >
          Нравится
        </button>
        <button className="action-btn" onClick={handleToggleComments}>
          Комментарии
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleAddComment} className="form-group">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Написать комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </form>

          {loadingComments ? (
            <div style={{padding: '10px', textAlign: 'center'}}>Загрузка...</div>
          ) : (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id || Math.random()} className="comment">
                  <div className="comment-body">
                    <div className="comment-author">{comment.author?.username || 'Пользователь'}</div>
                    <div className="comment-text">{comment.content}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;
