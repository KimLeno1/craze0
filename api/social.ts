import { Router } from 'express';
import { db } from './db';

const router = Router();

// Get All Social Posts
router.get('/posts', async (req, res) => {
  try {
    const posts = db.prepare('SELECT * FROM social_posts ORDER BY timestamp DESC').all();
    const parsedPosts = posts.map((p: any) => ({
      ...p,
      likedBy: JSON.parse(p.likedBy || '[]'),
      lovedBy: JSON.parse(p.lovedBy || '[]'),
      tags: JSON.parse(p.tags || '[]')
    }));
    res.json(parsedPosts);
  } catch (error) {
    console.error('Error fetching social posts:', error);
    res.status(500).json({ error: 'Failed to fetch social posts' });
  }
});

// Like Post
router.post('/posts/:id/like', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const post = db.prepare('SELECT * FROM social_posts WHERE id = ?').get(id) as any;
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const likedBy = JSON.parse(post.likedBy || '[]') as string[];
    if (!likedBy.includes(userId)) {
      likedBy.push(userId);
      db.prepare('UPDATE social_posts SET likes = ?, likedBy = ? WHERE id = ?')
        .run(likedBy.length, JSON.stringify(likedBy), id);
    }
    
    const updatedPost = db.prepare('SELECT * FROM social_posts WHERE id = ?').get(id) as any;
    res.json({
      ...updatedPost,
      likedBy: JSON.parse(updatedPost.likedBy || '[]'),
      lovedBy: JSON.parse(updatedPost.lovedBy || '[]'),
      tags: JSON.parse(updatedPost.tags || '[]')
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Love Post
router.post('/posts/:id/love', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const post = db.prepare('SELECT * FROM social_posts WHERE id = ?').get(id) as any;
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const lovedBy = JSON.parse(post.lovedBy || '[]') as string[];
    if (!lovedBy.includes(userId)) {
      lovedBy.push(userId);
      db.prepare('UPDATE social_posts SET loves = ?, lovedBy = ? WHERE id = ?')
        .run(lovedBy.length, JSON.stringify(lovedBy), id);
    }
    
    const updatedPost = db.prepare('SELECT * FROM social_posts WHERE id = ?').get(id) as any;
    res.json({
      ...updatedPost,
      likedBy: JSON.parse(updatedPost.likedBy || '[]'),
      lovedBy: JSON.parse(updatedPost.lovedBy || '[]'),
      tags: JSON.parse(updatedPost.tags || '[]')
    });
  } catch (error) {
    console.error('Error loving post:', error);
    res.status(500).json({ error: 'Failed to love post' });
  }
});

// Bulk Save Posts
router.post('/posts/bulk', async (req, res) => {
  const { posts } = req.body;
  try {
    const insert = db.prepare(`
      INSERT OR REPLACE INTO social_posts (id, userId, username, userImage, image, caption, likes, loves, likedBy, lovedBy, timestamp, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction((postsToSave) => {
      for (const p of postsToSave) {
        insert.run(
          p.id, p.userId, p.username, p.userImage, p.image, p.caption,
          p.likes || 0, p.loves || 0, 
          JSON.stringify(p.likedBy || []), 
          JSON.stringify(p.lovedBy || []),
          p.timestamp || Date.now(),
          JSON.stringify(p.tags || [])
        );
      }
    });

    transaction(posts);
    res.json({ success: true });
  } catch (error) {
    console.error('Error bulk saving social posts:', error);
    res.status(500).json({ error: 'Failed to save social posts' });
  }
});

export default router;
