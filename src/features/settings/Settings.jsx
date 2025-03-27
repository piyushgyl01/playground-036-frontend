import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateUser, logout, selectCurrentUser } from '../auth/authSlice';
import { selectSettingsStatus, selectSettingsError, resetSettingsState } from './settingsSlice';

const Settings = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const currentUser = useAppSelector(selectCurrentUser);
  const status = useAppSelector(selectSettingsStatus);
  const error = useAppSelector(selectSettingsError);
  
  const [image, setImage] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  
  // Populate form with user data
  useEffect(() => {
    if (currentUser) {
      setImage(currentUser.image || '');
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
      setEmail(currentUser.email || '');
    }
    
    return () => {
      dispatch(resetSettingsState());
    };
  }, [dispatch, currentUser]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    const userData = {
      image,
      username,
      bio,
      email
    };
    
    // Only include password if it's provided
    if (password) {
      userData.password = password;
    }
    
    try {
      await dispatch(updateUser(userData)).unwrap();
      navigate(`/profile/${username}`);
    } catch (err) {
      // Error is handled in the auth slice
      window.scrollTo(0, 0);
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  if (!currentUser) {
    return <div>Loading...</div>;
  }
  
  return (
    <Container className="settings-page py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-4">Your Settings</h1>
          
          {error && (
            <Alert variant="danger">
              {typeof error === 'object' ? (
                <ul className="mb-0 ps-3">
                  {Object.entries(error).map(([key, value]) => (
                    <li key={key}>{key} {value}</li>
                  ))}
                </ul>
              ) : (
                error
              )}
            </Alert>
          )}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formImage">
              <Form.Label>Profile Picture URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="URL of profile picture"
                value={image}
                onChange={e => setImage(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Username is required.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formBio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Short bio about you"
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="New Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
              />
              <Form.Text className="text-muted">
                Leave blank to keep your current password.
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                Password must be at least 6 characters.
              </Form.Control.Feedback>
            </Form.Group>
            
            <div className="d-grid gap-2">
              <Button 
                variant="success" 
                type="submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Updating...' : 'Update Settings'}
              </Button>
            </div>
          </Form>
          
          <hr className="my-4" />
          
          <div className="text-center">
            <Button 
              variant="outline-danger" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;