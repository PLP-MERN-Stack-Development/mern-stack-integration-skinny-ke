import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Posts from './pages/Posts'
import CreatePost from './pages/CreatePost'
import Register from './pages/Register';
import Login from './pages/Login'
import './styles.css'

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>MERN Blog</h1>
          <nav>
            <Link to="/">Home</Link> | <Link to="/posts">Posts</Link> | <Link to="/create">Create</Link> | <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
          </nav>
        </header>
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

createRoot(document.getElementById('root')).render(<App />)
