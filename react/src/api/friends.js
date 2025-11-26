import { instance } from './axios';

export const getFriends = () => {
  return instance.get('/api/friends/');
};

export const sendFriendRequest = (data) => {
  return instance.post('/api/friends/request/', data);
};

export const acceptFriendRequest = (id) => {
  return instance.post(`/api/friends/${id}/accept/`);
};
