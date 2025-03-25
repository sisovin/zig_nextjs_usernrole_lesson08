import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res);
    default:
      res.setHeader('Allow', ['GET']);
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

  const userId = decoded.userId;

  const income = await prisma.transaction.aggregate({
    where: { userId, type: 'income' },
    _sum: { amount: true },
  });

  const expenses = await prisma.transaction.aggregate({
    where: { userId, type: 'expense' },
    _sum: { amount: true },
  });

  const savings = await prisma.transaction.aggregate({
    where: { userId, type: 'saving' },
    _sum: { amount: true },
  });

  const report = {
    income: income._sum.amount || 0,
    expenses: expenses._sum.amount || 0,
    savings: savings._sum.amount || 0,
  };

  return res.status(200).json(report);
}
