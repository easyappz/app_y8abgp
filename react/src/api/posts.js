import { instance } from './axios';

export const getPosts = (page) => {
  return instance.get('/api/posts/', { params: { page } });
};

export const createPost = (data) => {
  return instance.post('/api/posts/', data);
};

export const deletePost = (id) => {
  return instance.delete(`/api/posts/${id}/`);
};
