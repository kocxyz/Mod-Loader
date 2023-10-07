import { Collector } from '@/generation/collector';

export type VJsonGenerator<Type> = {
  createFiles: (outDir: string, collector: Collector<Type>) => void | Promise<void>;
};
