import React, { useState, useEffect } from 'react';
import { postService, categoryService } from '../api';

export default function CreatePost(){
  const [title,setTitle] = useState('');
  const [content,setContent] = useState('');
  const [category,setCategory] = useState('');
  const [categories,setCategories] = useState([]);
  const [message,setMessage] = useState('');

  useEffect(() => {
    async function fetchCategories(){
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories', err);
      }
    }
    fetchCategories();
  }, []);

  async function submit(e){
    e.preventDefault();
    if(!title || !content || !category){
      setMessage('Please fill all fields');
      return;
    }
    try {
      await postService.createPost({ title, content, category });
      setMessage('✅ Post created successfully');
      setTitle('');
      setContent('');
      setCategory('');
    } catch (err) {
      console.error(err);
      setMessage('❌ Error creating post');
    }
  }

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={submit}>
        <input 
          placeholder="Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
        /><br/>

        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select><br/>

        <textarea 
          placeholder="Content" 
          value={content} 
          onChange={e => setContent(e.target.value)} 
        /><br/>

        <button type="submit">Create</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
