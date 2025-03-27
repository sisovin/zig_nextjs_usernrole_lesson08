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

  const transactions = await prisma.transaction.findMany({
    where: { userId: decoded.userId },
  });

  return res.status(200).json(transactions);
}

async function handlePost(req, res) {
  const { authorization } = req.headers;
  const { type, amount } = req.body;

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

  const transaction = await prisma.transaction.create({
    data: {
      userId: decoded.userId,
      type,
      amount,
    },
  });

  return res.status(201).json(transaction);
}

async function handlePut(req, res) {
  const { authorization } = req.headers;
  const { id, type, amount } = req.body;

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

  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      type,
      amount,
    },
  });

  return res.status(200).json(transaction);
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

  await prisma.transaction.delete({
    where: { id },
  });

  return res.status(200).json({ message: 'Transaction deleted' });
}
