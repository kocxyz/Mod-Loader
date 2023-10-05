import { ModManifestSchema, type Mod, type ModManifest, type ModModule } from '@/types';
import { generateErrorMessage } from 'zod-error';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

type ModLoaderOptions = {
  modDir: string;
};

const manifestPath = 'manifest.yaml';

export class ModLoader {
  private options: ModLoaderOptions;

  constructor(options: Partial<ModLoaderOptions> = {}) {
    this.options = {
      modDir: 'mods',
      ...options,
    };
  }

  loadMods(): Mod[] {
    const modPaths = fs.readdirSync(this.options.modDir);
    return modPaths.map((mod) => this.loadMod(path.join(this.options.modDir, mod)));
  }

  private loadModManifest(modPath: string): ModManifest {
    const modManifestPath = path.join(modPath, manifestPath);
    const modManifestStat = fs.statSync(modManifestPath, { throwIfNoEntry: false });

    if (!modManifestStat) {
      throw Error(`Could not find '${manifestPath}' for mod in path '${modPath}'`);
    }

    if (!modManifestStat.isFile()) {
      throw Error(`'${manifestPath}' in '${modPath}' is not a file.`);
    }

    const manifestContent = yaml.load(fs.readFileSync(modManifestPath, 'utf-8'));
    const parseResult = ModManifestSchema.safeParse(manifestContent);

    if (!parseResult.success) {
      throw Error(
        `'${manifestPath}' in '${modPath}' is not valid. The following parsing issues occured: ${generateErrorMessage(
          parseResult.error.errors
        )}`
      );
    }

    return parseResult.data;
  }

  private loadMod(modPath: string): Mod {
    const manifest = this.loadModManifest(modPath);
    const entrypointModule = this.loadModModule(path.join(modPath, manifest.entrypoint));
    return {
      manifest: manifest,
      entrypoint: entrypointModule,
      modules: {},
    };
  }

  private loadModModule(modModulePath: string): ModModule {
    const content = fs.readFileSync(modModulePath, 'utf8');
    return {
      name: modModulePath,
      content,
    };
  }
}
