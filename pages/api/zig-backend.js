import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'GET' && req.url === '/api/zig-backend') {
    const response = await fetch('http://localhost:8080/api/zig-endpoint');
    const data = await response.json();
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: 'Not Found' });
  }
}
