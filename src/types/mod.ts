import { z } from 'zod';
import { ZodSemver } from 'zod-semver';

export type ModModule = {
  name: string;
  content: string;
};

export type Mod = {
  manifest: ModManifest;
  entrypoint: ModModule;
  modules: { [name: string]: ModModule };
};

export type ModManifest = z.infer<typeof ModManifestSchema>;

export const ModManifestSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    author: z.string().min(1),

    version: ZodSemver,

    entrypoint: z.string().optional().default('index.js'),

    compatible_versions: z.array(z.number()),
  })
  .strict();
