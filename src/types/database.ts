import { Prisma } from '@prisma/client';

type IgnorePrismaBuiltins<S extends string | symbol> = string extends S
  ? string
  : S extends ''
  ? S
  : S extends `$${infer T}`
  ? never
  : S;

export type PrismaModelName = Prisma.TypeMap['meta']['modelProps'];
export type PrismaOperation = keyof Prisma.TypeMap['model'][Prisma.TypeMap['meta']['modelProps']]['operations'];
