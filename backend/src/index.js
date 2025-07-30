import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/tournaments', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tournaments ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.post('/api/tournaments', async (req, res) => {
  const { name, player_count, type } = req.body;
  if (!name || !player_count || !type) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  if (player_count % 4 !== 0) {
    return res.status(400).json({ error: 'Player count must be multiple of 4' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO tournaments (name, player_count, type) VALUES ($1,$2,$3) RETURNING *',
      [name, player_count, type]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
