import { ModManifestSchema, type Mod, type ModManifest, type ModModule } from '@/types';
import { generateErrorMessage } from 'zod-error';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { globSync } from 'glob';

type ModLoaderOptions = {
  modDir: string;
  manifestPath: string;
  modExtension: string;
};

export class ModLoader {
  private options: ModLoaderOptions;

  constructor(options: Partial<ModLoaderOptions> = {}) {
    this.options = {
      modDir: 'mods',
      manifestPath: 'manifest.yaml',
      modExtension: 'js',
      ...options,
    };
  }

  loadMods(): Mod[] {
    const modPaths = fs.readdirSync(this.options.modDir);
    return modPaths.map((mod) => this.loadMod(path.join(this.options.modDir, mod)));
  }

  private loadModManifest(modPath: string): ModManifest {
    const modManifestPath = path.join(modPath, this.options.manifestPath);
    const modManifestStat = fs.statSync(modManifestPath, { throwIfNoEntry: false });

    if (!modManifestStat) {
      throw Error(`Could not find '${this.options.manifestPath}' for mod in path '${modPath}'`);
    }

    if (!modManifestStat.isFile()) {
      throw Error(`'${this.options.manifestPath}' in '${modPath}' is not a file.`);
    }

    const manifestContent = yaml.load(fs.readFileSync(modManifestPath, 'utf-8'));
    const parseResult = ModManifestSchema.safeParse(manifestContent);

    if (!parseResult.success) {
      throw Error(
        `'${
          this.options.manifestPath
        }' in '${modPath}' is not valid. The following parsing issues occured: ${generateErrorMessage(
          parseResult.error.errors
        )}`
      );
    }

    return parseResult.data;
  }

  private loadMod(modPath: string): Mod {
    const manifest = this.loadModManifest(modPath);
    const entrypointModule = this.loadModModule(modPath, manifest.entrypoint);

    return {
      manifest: manifest,
      entrypoint: entrypointModule,
      modules: {
        [manifest.entrypoint]: entrypointModule,
        ...this.loadModModules(modPath).reduce((acc, module) => {
          return {
            [module.specifier]: module,
            ...acc,
          };
        }, {}),
      },
    };
  }

  private loadModModules(modPath: string): ModModule[] {
    const modulePaths = globSync(`${modPath}/**/*.${this.options.modExtension}`);
    return modulePaths.map((modulePath) => this.loadModModule(modPath, path.relative(modPath, modulePath)));
  }

  private loadModModule(modPath: string, modulePath: string): ModModule {
    const modModulePath = path.join(modPath, modulePath);
    const content = fs.readFileSync(modModulePath, 'utf8');
    return {
      name: path.basename(modModulePath),
      specifier: modulePath,
      content,
    };
  }
}
