import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useHistory } from 'react-router-dom';
import { assets } from '../../assets/assets';
import axios from 'axios';
import ReactQuill from 'react-quill';

const Profile = ({ setIsLoggedIn }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(localStorage.getItem('profileImageUrl') || assets.defaultpfp2);
  const [name, setName] = useState(localStorage.getItem('userName') || '');
  const [drafts, setDrafts] = useState([]);
  const [draftCount, setDraftCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState(null);
  const [showProfilePictureDeleteModal, setShowProfilePictureDeleteModal] = useState(false); 

  const history = useHistory();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!localStorage.getItem('profileImageUrl') || !localStorage.getItem('userName')) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get('/api/user/profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const profilePictureUrl = response.data.profilePicture || assets.defaultpfp2;
          const fetchedName = response.data.name || '';

          if (profilePictureUrl !== assets.defaultpfp2) {
            setImageFileUrl(profilePictureUrl);
            localStorage.setItem('profileImageUrl', profilePictureUrl);
          }

          if (fetchedName) {
            setName(fetchedName);
            localStorage.setItem('userName', fetchedName);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
      fetchUserData();
    }
  }, []);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await axios.get('/api/stories/drafts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setDrafts(response.data);
        setDraftCount(response.data.length);
      } catch (error) {
        console.error('Error fetching drafts:', error);
      }
    };
    fetchDrafts();
  }, []);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImageFileUrl(previewUrl);
    }
  };

  const handleProfilePictureDeleteClick = () => {
    setShowProfilePictureDeleteModal(true);
  };

  const confirmResetProfilePicture = async () => {
    try {
      const response = await fetch('/api/user/delete-profile-picture', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const defaultPicture = assets.defaultpfp2;
        setImageFileUrl(defaultPicture);
        localStorage.setItem('profileImageUrl', defaultPicture);
      } else {
        console.error('Failed to delete profile picture');
      }
    } catch (error) {
      console.error('Error deleting profile picture:', error);
    }

    setShowProfilePictureDeleteModal(false);
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('userId', userId);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        const uploadedImageUrl = `http://localhost:5000/public/Images/${response.data.result.image}`;
        setImageFileUrl(uploadedImageUrl);
        localStorage.setItem('profileImageUrl', uploadedImageUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('profileImageUrl');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    history.push('/');
  };

  const handleDeleteDraftClick = (id) => {
    setDraftToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteDraft = async () => {
    try {
      await axios.delete(`/api/stories/${draftToDelete}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDrafts(drafts.filter(draft => draft._id !== draftToDelete));
      setDraftCount(draftCount - 1);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  };

  const cancelDeleteDraft = () => {
    setDraftToDelete(null);
    setShowDeleteModal(false);
  };
  const handleEditDraft = (draft) => {
    history.push({
      pathname: '/chapters',
      state: { storyData: draft }
    });
  };
  return (
    <div className="profile-container">
      <div className="background-picture">
        <img src={assets.backgroundImage} alt="Background" className="background-image" />
      </div>
      <div className="profile-content">
        <div className="profile-picture-container">
          <img src={imageFileUrl} alt="Profile" className="profile-picture" />
          <label htmlFor="profile-picture-input" className="change-picture-btn">
            Change Picture
          </label>
          <input
            id="profile-picture-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleProfilePictureChange}
          />
          {imageFileUrl !== assets.defaultpfp2 && (
            <button className="reset-picture-btn" onClick={handleProfilePictureDeleteClick}>
              X
            </button>
          )}
        </div>
        <div className="username">
          <h2>✧✧ {name ? name : ''} ✧✧</h2>
        </div>
        <div className="count-container">
          <div className="count-box">
            <h2>Follower Count</h2>
            <p>0</p>
          </div>
          <div className="count-box">
            <h2>Following Count</h2>
            <p>0</p>
          </div>
          <div className="count-box">
            <h2>Story Count</h2>
            <p>0</p>
          </div>
        </div>
        <div className="top-right">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
        <div className="drafts-section">
          <h2>Your Drafts ({draftCount})</h2>
          <div className="stories-container">
            {drafts.length === 0 ? (
              <p>No drafts found</p>
            ) : (
              drafts.map((draft) => (
                <div key={draft._id} className="story-card">
                  <div className="story-card-header">
                  <ReactQuill 
                  value={draft.topicName}
                  readOnly={true}
                  theme="bubble"
                />
                    <button onClick={() => handleDeleteDraftClick(draft._id)} className="delete-draft-icon">✕</button>
                    <button className="edit-btn" onClick={() => handleEditDraft(draft)}>Edit</button>
                  </div>
                  <ReactQuill 
                  value={draft.description}
                  readOnly={true}
                  theme="bubble"
                />
                </div>
              ))
            )}
          </div>
        </div>
        {showDeleteModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Are you sure you want to delete this draft?</h3>
              <div className="modal-buttons">
                <button className="modal-button confirm" onClick={confirmDeleteDraft}>Yes</button>
                <button className="modal-button cancel" onClick={cancelDeleteDraft}>No</button>
              </div>
            </div>
          </div>
        )}

        {showProfilePictureDeleteModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Are you sure you want to delete your profile picture?</h3>
              <div className="modal-buttons">
                <button className="modal-button confirm" onClick={confirmResetProfilePicture}>Yes</button>
                <button className="modal-button cancel" onClick={() => setShowProfilePictureDeleteModal(false)}>No</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
