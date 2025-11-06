import React, { useEffect, useState } from 'react';
import { postService } from '../api';

export default function Posts(){
  const [posts,setPosts]=useState([]);
  const [page,setPage]=useState(1);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{ load(); },[page]);

  async function load(){ setLoading(true); try{ const res = await postService.getAllPosts(page,6); setPosts(res.posts || []); }catch(err){ console.error(err);} finally{ setLoading(false); } }

  return (
    <div>
      <h2>All Posts</h2>
      {loading && <p>Loading...</p>}
      <div>{posts.map(p=> <article key={p._id}><h3>{p.title}</h3><p>{p.excerpt || p.content.substring(0,140)}</p></article>)}</div>
      <div style={{marginTop:20}}>
        <button onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
        <span style={{margin:'0 8px'}}>Page {page}</span>
        <button onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  )
}
