import Fastify from 'fastify';
import PrismaClient from '@prisma/client';
import cors from '@fastify/cors';

const { PrismaClient: Prisma } = PrismaClient;
const prisma = new Prisma();
const fastify = Fastify({ logger: true });

// Enable CORS
fastify.register(cors, { origin: '*' });

// Routes
fastify.get('/users', async (request, reply) => {
  const users = await prisma.user.findMany();
  return { users };
});

fastify.get('/users/:id', async (request, reply) => {
  const { id } = request.params;
  const user = await prisma.user.findUnique({ where: { id: parseInt(id, 10) } });
  if (!user) {
    return reply.status(404).send({ error: 'User not found' });
  }
  return { user };
});

fastify.post('/users', async (request, reply) => {
  const { name, email } = request.body;
  try {
    const user = await prisma.user.create({
      data: { name, email },
    });
    return reply.status(201).send({ user });
  } catch (error) {
    return reply.status(400).send({ error: 'Error creating user', details: error.message });
  }
});

fastify.put('/users/:id', async (request, reply) => {
  const { id } = request.params;
  const { name, email } = request.body;
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: { name, email },
    });
    return { user };
  } catch (error) {
    return reply.status(400).send({ error: 'Error updating user', details: error.message });
  }
});

fastify.delete('/users/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    await prisma.user.delete({ where: { id: parseInt(id, 10) } });
    return reply.status(204).send();
  } catch (error) {
    return reply.status(400).send({ error: 'Error deleting user', details: error.message });
  }
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Fastify server is running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
