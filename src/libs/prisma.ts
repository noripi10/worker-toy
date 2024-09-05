import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

export const createClient = (env: Env) => {
	const adapter = new PrismaD1(env.MY_WORKER_TOY_DB);
	const prisma = new PrismaClient({ adapter });

	return prisma;
};
