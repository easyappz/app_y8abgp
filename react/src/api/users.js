import { instance } from './axios';

export const updateProfile = (data) => {
  return instance.patch('/api/users/me/', data);
};

export const getUserProfile = (id) => {
  return instance.get(`/api/users/${id}/`);
};
