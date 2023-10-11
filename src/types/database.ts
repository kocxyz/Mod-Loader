import { Prisma } from '@prisma/client';

export type PrismaModelName = Prisma.TypeMap['meta']['modelProps'];
export type PrismaOperation = keyof Prisma.TypeMap['model'][Prisma.TypeMap['meta']['modelProps']]['operations'];
