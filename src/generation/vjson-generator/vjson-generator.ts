import type { Collector, GlobalCollectors } from '@/generation';

export type VJsonGenerator<Type> = {
  createFiles: (outDir: string, collector: Collector<Type>, globalCollectors: GlobalCollectors) => void | Promise<void>;
};
