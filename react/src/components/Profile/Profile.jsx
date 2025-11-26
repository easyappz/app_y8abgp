import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../../api/users';
import { getFriends } from '../../api/friends';

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Profile
        if (id) {
          const profileRes = await getUserProfile(id);
          setProfile(profileRes.data);
        }
        // Fetch Friends (Functionality strictly for current user as per API typically, 
        // but if we are viewing others, we might not see their friends unless API supports it)
        // The default friends API is /api/friends/ (My friends).
        // We'll just fetch "My" friends for now if visiting own profile logic matches, 
        // or just leave it separate.
        const friendsRes = await getFriends();
        setFriends(friendsRes.data);
      } catch (error) {
        console.error('Profile fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="container">Загрузка профиля...</div>;
  if (!profile) return <div className="container">Профиль не найден</div>;

  return (
    <div className="profile-wrapper" data-easytag="id1-react/src/components/Profile/Profile.jsx">
      <div className="profile-header">
        <div className="cover-photo"></div>
        <div className="profile-info">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {profile.avatar ? <img src={profile.avatar} alt="Avatar" /> : profile.username[0]}
            </div>
            <div className="profile-names">
              <div className="profile-name">{profile.username}</div>
              <div className="profile-bio">{profile.bio || 'Нет информации'}</div>
            </div>
          </div>
          {/* Add Friend / Message buttons could go here */}
        </div>
      </div>

      <div className="profile-content">
        <div className="sidebar-left">
          <div className="content-card">
            <h3>Информация</h3>
            <p>Email: {profile.email || 'Скрыт'}</p>
            <p>ID: {profile.id}</p>
          </div>
          
          <div className="content-card">
            <h3>Друзья</h3>
            {friends.length === 0 ? (
              <p>Список друзей пуст</p>
            ) : (
              <div className="friends-grid">
                {friends.map(friend => (
                  <div key={friend.id}>{friend.username}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="main-content">
          {/* Maybe user's posts here in future */}
          <div className="content-card">
            <p>Посты пользователя (в разработке)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
