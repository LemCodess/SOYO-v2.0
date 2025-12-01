import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useHistory } from 'react-router-dom';
import { assets } from '../../assets/assets';
import axios from 'axios';
import ReactQuill from 'react-quill';

const Profile = ({ setIsLoggedIn }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [memberSince, setMemberSince] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [publishedStories, setPublishedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState(null);
  const [showProfilePictureDeleteModal, setShowProfilePictureDeleteModal] = useState(false);

  const history = useHistory();
  const userId = localStorage.getItem('userId');

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching user profile...');
        const response = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        console.log('Profile response:', response.data);
        const userData = response.data.user;
        setName(userData.name || '');
        setEmail(userData.email || '');
        setImageFileUrl(userData.profilePicture || assets.defaultpfp);

        console.log('Profile picture URL:', userData.profilePicture);
        console.log('Image field:', userData.image);

        // Format member since date
        if (userData.createdAt) {
          const date = new Date(userData.createdAt);
          setMemberSince(date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
          }));
        }

        // Update localStorage
        localStorage.setItem('userName', userData.name || '');
        if (userData.profilePicture) {
          localStorage.setItem('profileImageUrl', userData.profilePicture);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        console.error('Error response:', error.response?.data);
      }
    };

    fetchUserData();
  }, []);

  // Fetch drafts
  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await axios.get('/api/stories/drafts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setDrafts(response.data);
      } catch (error) {
        console.error('Error fetching drafts:', error);
      }
    };

    fetchDrafts();
  }, []);

  // Fetch published stories
  useEffect(() => {
    const fetchPublishedStories = async () => {
      try {
        const response = await axios.get('/api/stories/published', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        // Filter stories by current user
        const userStories = response.data.filter(
          story => story.userId === userId || story.author === name
        );
        setPublishedStories(userStories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching published stories:', error);
        setLoading(false);
      }
    };

    if (userId || name) {
      fetchPublishedStories();
    }
  }, [userId, name]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImageFileUrl(previewUrl);
      // Auto-upload on selection
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    try {
      const response = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Upload response:', response.data);

      if (response.data.success && response.data.user) {
        const uploadedImageUrl = response.data.user.profilePicture;

        // Update local state
        setImageFileUrl(uploadedImageUrl);

        // Update localStorage
        localStorage.setItem('profileImageUrl', uploadedImageUrl);

        console.log('Profile picture uploaded and saved successfully!');
        console.log('Image URL:', uploadedImageUrl);

        // Verify the upload by refetching profile data
        setTimeout(async () => {
          try {
            const verifyResponse = await axios.get('/api/user/profile', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log('Profile verification after upload:', verifyResponse.data);
          } catch (err) {
            console.error('Error verifying profile:', err);
          }
        }, 500);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      console.error('Error details:', error.response?.data);
      const errorMsg = error.response?.data?.error || error.message || 'Unknown error';
      alert(`Failed to upload profile picture: ${errorMsg}`);
    } finally {
      setUploading(false);
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
        const defaultPicture = assets.defaultpfp;
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

  const handleViewStory = (storyId) => {
    history.push(`/story/${storyId}`);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-picture-section">
            <div className="profile-picture-wrapper">
              <img
                src={imageFileUrl || assets.defaultpfp}
                alt="Profile"
                className="profile-picture"
              />
              {uploading && (
                <div className="upload-overlay">
                  <div className="upload-spinner"></div>
                </div>
              )}
              {imageFileUrl !== assets.defaultpfp && !uploading && (
                <button
                  className="delete-picture-btn"
                  onClick={handleProfilePictureDeleteClick}
                  title="Remove profile picture"
                >
                  ×
                </button>
              )}
            </div>
            <label htmlFor="profile-picture-input" className="change-picture-btn">
              <span className="btn-icon">📷</span>
              Change Picture
            </label>
            <input
              id="profile-picture-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfilePictureChange}
            />
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{name}</h1>
            <p className="profile-email">{email}</p>
            {memberSince && (
              <p className="profile-member-since">Member since {memberSince}</p>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-number">{publishedStories.length}</div>
            <div className="stat-label">Published Stories</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{drafts.length}</div>
            <div className="stat-label">Drafts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Followers</div>
          </div>
        </div>

        <div className="profile-sections">
          {/* Published Stories Section */}
          <section className="profile-section">
            <div className="section-header">
              <h2 className="section-title">Published Stories</h2>
              <span className="section-count">{publishedStories.length} {publishedStories.length === 1 ? 'story' : 'stories'}</span>
            </div>
            {loading ? (
              <div className="section-loading">
                <div className="loading-spinner"></div>
                <p>Loading stories...</p>
              </div>
            ) : publishedStories.length === 0 ? (
              <div className="section-empty">
                <div className="empty-icon">📚</div>
                <p>No published stories yet</p>
                <button className="write-story-btn" onClick={() => history.push('/write')}>
                  Write Your First Story
                </button>
              </div>
            ) : (
              <div className="stories-grid">
                {publishedStories.map((story) => (
                  <div
                    key={story._id}
                    className="story-card-profile"
                    onClick={() => handleViewStory(story._id)}
                  >
                    <div className="story-card-content">
                      <ReactQuill
                        value={story.topicName}
                        readOnly={true}
                        theme="bubble"
                        className="story-title-quill"
                      />
                      <ReactQuill
                        value={story.description}
                        readOnly={true}
                        theme="bubble"
                        className="story-desc-quill"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Drafts Section */}
          <section className="profile-section">
            <div className="section-header">
              <h2 className="section-title">Drafts</h2>
              <span className="section-count">{drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'}</span>
            </div>
            {drafts.length === 0 ? (
              <div className="section-empty">
                <div className="empty-icon">✍️</div>
                <p>No drafts found</p>
              </div>
            ) : (
              <div className="stories-grid">
                {drafts.map((draft) => (
                  <div key={draft._id} className="story-card-profile draft-card">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDraftClick(draft._id);
                      }}
                      className="delete-draft-btn"
                      title="Delete draft"
                    >
                      ×
                    </button>
                    <div className="story-card-content">
                      <ReactQuill
                        value={draft.topicName}
                        readOnly={true}
                        theme="bubble"
                        className="story-title-quill"
                      />
                      <ReactQuill
                        value={draft.description}
                        readOnly={true}
                        theme="bubble"
                        className="story-desc-quill"
                      />
                    </div>
                    <button
                      className="edit-draft-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditDraft(draft);
                      }}
                    >
                      Edit Draft
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Delete Draft Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Draft?</h3>
            <p>Are you sure you want to delete this draft? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button className="modal-btn modal-btn-confirm" onClick={confirmDeleteDraft}>
                Delete
              </button>
              <button className="modal-btn modal-btn-cancel" onClick={cancelDeleteDraft}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Profile Picture Modal */}
      {showProfilePictureDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Remove Profile Picture?</h3>
            <p>Your profile picture will be reset to the default image.</p>
            <div className="modal-buttons">
              <button className="modal-btn modal-btn-confirm" onClick={confirmResetProfilePicture}>
                Remove
              </button>
              <button className="modal-btn modal-btn-cancel" onClick={() => setShowProfilePictureDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
