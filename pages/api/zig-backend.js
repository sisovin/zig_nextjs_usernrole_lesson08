import fetch from 'node-fetch';

export default async function handler(req, res) {
  const response = await fetch("http://localhost:3001/api/zig-endpoint");
  const data = await response.json();
  res.status(200).json(data);
}
