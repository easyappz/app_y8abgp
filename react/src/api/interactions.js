import { instance } from './axios';

export const toggleLike = (id) => {
  return instance.post(`/api/posts/${id}/like/`);
};

export const getComments = (id) => {
  return instance.get(`/api/posts/${id}/comments/`);
};

export const addComment = (id, data) => {
  return instance.post(`/api/posts/${id}/comments/`, data);
};
