import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleGet(req, res) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  const token = authorization.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const savingGoals = await prisma.savingGoal.findMany({
    where: { userId: decoded.userId },
  });

  return res.status(200).json(savingGoals);
}

async function handlePost(req, res) {
  const { authorization } = req.headers;
  const { goal } = req.body;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  const token = authorization.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const savingGoal = await prisma.savingGoal.create({
    data: {
      userId: decoded.userId,
      goal,
    },
  });

  return res.status(201).json(savingGoal);
}

async function handlePut(req, res) {
  const { authorization } = req.headers;
  const { id, goal } = req.body;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  const token = authorization.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const savingGoal = await prisma.savingGoal.update({
    where: { id },
    data: {
      goal,
    },
  });

  return res.status(200).json(savingGoal);
}

async function handleDelete(req, res) {
  const { authorization } = req.headers;
  const { id } = req.body;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  const token = authorization.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  await prisma.savingGoal.delete({
    where: { id },
  });

  return res.status(200).json({ message: 'Saving goal deleted' });
}
