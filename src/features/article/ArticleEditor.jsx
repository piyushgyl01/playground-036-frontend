import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { 
  getArticle,
  createArticle,
  updateArticle,
  selectArticle,
  selectArticleStatus,
  selectArticleError,
  resetArticleState
} from './articleSlice';

const ArticleEditor = () => {
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const article = useAppSelector(selectArticle);
  const status = useAppSelector(selectArticleStatus);
  const error = useAppSelector(selectArticleError);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tagList, setTagList] = useState([]);
  const [validated, setValidated] = useState(false);
  
  // Load article data if editing an existing article
  useEffect(() => {
    if (slug) {
      dispatch(getArticle(slug));
    } else {
      dispatch(resetArticleState());
    }
    
    return () => {
      dispatch(resetArticleState());
    };
  }, [dispatch, slug]);
  
  // Populate form with article data when available
  useEffect(() => {
    if (slug && article) {
      setTitle(article.title || '');
      setDescription(article.description || '');
      setBody(article.body || '');
      setTagList(article.tagList || []);
    }
  }, [slug, article]);
  
  const addTag = () => {
    if (tagInput.trim() && !tagList.includes(tagInput.trim())) {
      setTagList([...tagList, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const removeTag = (tag) => {
    setTagList(tagList.filter(t => t !== tag));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    const articleData = {
      title,
      description,
      body,
      tagList
    };
    
    try {
      if (slug) {
        // Update existing article
        const updatedArticle = await dispatch(
          updateArticle({ slug, article: articleData })
        ).unwrap();
        
        navigate(`/article/${updatedArticle.slug}`);
      } else {
        // Create new article
        const newArticle = await dispatch(
          createArticle(articleData)
        ).unwrap();
        
        navigate(`/article/${newArticle.slug}`);
      }
    } catch (err) {
      // Error is handled in the article slice
      window.scrollTo(0, 0);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag();
    }
  };
  
  return (
    <Container className="article-editor py-4">
      <h1 className="text-center mb-4">
        {slug ? 'Edit Article' : 'New Article'}
      </h1>
      
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
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Article Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Title is required.
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="What's this article about?"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Description is required.
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="formBody">
          <Form.Label>Article Body</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            placeholder="Write your article (in markdown)"
            value={body}
            onChange={e => setBody(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Article body is required.
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="formTags">
          <Form.Label>Tags</Form.Label>
          <div className="d-flex">
            <Form.Control
              type="text"
              placeholder="Enter tags"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="me-2"
            />
            <Button 
              variant="outline-secondary" 
              onClick={addTag}
              type="button"
            >
              Add
            </Button>
          </div>
        </Form.Group>
        
        {tagList.length > 0 && (
          <div className="mb-3">
            {tagList.map(tag => (
              <span 
                key={tag} 
                className="badge bg-secondary me-1 mb-1 p-2"
              >
                {tag}
                <button 
                  type="button" 
                  className="btn-close btn-close-white ms-1 p-0" 
                  style={{ fontSize: '0.5rem' }}
                  onClick={() => removeTag(tag)}
                  aria-label="Remove tag"
                ></button>
              </span>
            ))}
          </div>
        )}
        
        <div className="d-grid gap-2">
          <Button 
            variant="success" 
            type="submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Saving...' : 'Publish Article'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default ArticleEditor;