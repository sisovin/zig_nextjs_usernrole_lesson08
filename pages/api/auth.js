import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const redis = new Redis();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return handlePost(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      res.setHeader('Allow', ['POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handlePost(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user && user.deletedAt) {
    return res.status(403).json({ error: 'Account is deactivated' });
  }

  if (user) {
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    await redis.set(token, JSON.stringify(user), 'EX', 3600);

    return res.status(200).json({ token });
  } else {
    const hashedPassword = await argon2.hash(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1h' });
    await redis.set(token, JSON.stringify(newUser), 'EX', 3600);

    return res.status(201).json({ token });
  }
}

async function handleDelete(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await prisma.user.update({
    where: { email },
    data: { deletedAt: new Date() },
  });

  return res.status(200).json({ message: 'Account deactivated' });
}
