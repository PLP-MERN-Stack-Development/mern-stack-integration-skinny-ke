import React, { useEffect, useState } from 'react';
import { postService } from '../api';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { posts } = await postService.getAllPosts(1, 6);
        setPosts(posts);
      } catch (err) {
        console.error(err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', padding: '2rem' }}>
      <h2>📰 Latest Posts</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && posts.length === 0 && <p>No posts available yet.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((p) => (
          <li key={p._id} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
            <h3>{p.title}</h3>
            <p>{p.excerpt || (p.content ? p.content.slice(0, 120) + '...' : '')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
