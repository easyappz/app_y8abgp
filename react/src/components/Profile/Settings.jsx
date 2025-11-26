import React, { useState, useEffect } from 'react';
import { updateProfile } from '../../api/users';
import { getCurrentUser } from '../../api/auth';

const Settings = () => {
  const [formData, setFormData] = useState({
    bio: '',
    avatar: '' // Assuming string URL for now as per spec (string, nullable)
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getCurrentUser();
        setFormData({
          bio: response.data.bio || '',
          avatar: response.data.avatar || ''
        });
      } catch (error) {
        console.error('Could not load settings', error);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Сохранение...');
    try {
      await updateProfile(formData);
      setStatus('Профиль обновлен успешно!');
    } catch (error) {
      console.error('Update failed', error);
      setStatus('Ошибка при обновлении.');
    }
  };

  return (
    <div className="container" data-easytag="id1-react/src/components/Profile/Settings.jsx">
      <div className="content-card" style={{width: '100%', maxWidth: '600px'}}>
        <h2>Настройки профиля</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>О себе (Bio)</label>
            <textarea
              className="form-control"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Ссылка на аватар</label>
            <input
              type="text"
              className="form-control"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://example.com/image.png"
            />
          </div>

          <button type="submit" className="btn-primary">
            Сохранить
          </button>
          
          {status && <p style={{marginTop: '15px', color: status.includes('Ошибка') ? 'red' : 'green'}}>{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default Settings;
