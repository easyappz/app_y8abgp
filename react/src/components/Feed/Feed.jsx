import React, { useState, useEffect } from 'react';
import { getPosts, createPost } from '../../api/posts';
import Post from './Post';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await getPosts();
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Не удалось загрузить ленту.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      const response = await createPost({ content: newPostContent });
      // Insert new post at top. The API returns created post data.
      const createdPost = {
        ...response.data,
        author: { username: 'Я' }, // Basic Assumption as API might not return full author obj instantly
        likes_count: 0,
        comments_count: 0
      };
      setPosts([createdPost, ...posts]);
      setNewPostContent('');
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Ошибка при создании поста');
    }
  };

  return (
    <div className="feed-container" data-easytag="id1-react/src/components/Feed/Feed.jsx">
      <div className="create-post-card">
        <form onSubmit={handleCreatePost}>
          <textarea
            className="create-post-textarea"
            placeholder="Что у вас нового?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Опубликовать
          </button>
        </form>
      </div>

      {loading && <div className="content-card">Загрузка ленты...</div>}
      {error && <div className="content-card">{error}</div>}

      <div className="posts-list">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
