import { z } from 'zod';
import { ZodSemver } from 'zod-semver';

/**
 * A representation of a module inside a mod.
 */
export type ModModule = {
  /**
   * The name of the module.
   */
  name: string;
  /**
   * The unique identifier for the module.
   *
   * @example
   * - `json`
   * - `src/index.ts`
   */
  specifier: string;
  /**
   * The source of the module.
   */
  source: string;
};

/**
 * A representation of a mod.
 */
export type Mod = {
  /**
   * The path where the mod is located
   */
  path: string;
  /**
   * The manifest data of the mod.
   */
  manifest: ModManifest;
  /**
   * The mod module that acts as entrypoint.
   */
  entrypoint: ModModule;
  /**
   * The modules that the mod contains.
   */
  modules: { [specifier: string]: ModModule };
};

export type ModManifest = z.infer<typeof ModManifestSchema>;
export const ModManifestSchema = z
  .object({
    /**
     * The name of the mod.
     */
    name: z.string().min(1),
    /**
     * A description of what the mod does.
     */
    description: z.string().min(1),
    /**
     * The name of the mod author.
     */
    author: z.string().min(1),
    /**
     * The version of the mod in semver format.
     */
    version: ZodSemver,
    /**
     * The path to the entrypoint module.
     */
    entrypoint: z.string().optional().default('index.js'),
    /**
     * The game versions the mod is compatible with.
     */
    compatible_versions: z.array(z.number()),
  })
  .strict();
