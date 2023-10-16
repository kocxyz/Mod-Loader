import { ModManifestSchema, type Mod, type ModManifest, type ModModule } from '@/types';
import { generateErrorMessage } from 'zod-error';
import { globSync } from 'glob';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

type ModLoaderOptions = {
  /**
   * The directory where the mods are located.
   *
   * @default `mods`
   */
  modDir: string;
  /**
   * The relative path to the manifest file inside the mod folder.
   *
   * @default `manifest.yml`
   */
  manifestPath: string;
  /**
   * The extension of the mod module files.
   *
   * @default `js`
   */
  modModuleExtension: string;
};

export class ModLoader {
  private options: ModLoaderOptions;

  constructor(options: Partial<ModLoaderOptions> = {}) {
    this.options = {
      modDir: 'mods',
      manifestPath: 'manifest.yaml',
      modModuleExtension: 'js',
      ...options,
    };
  }

  /**
   * Load the mods inside the mod folder.
   *
   * @returns The loaded mods
   */
  loadMods(): Mod[] {
    const modPaths = fs.readdirSync(this.options.modDir);
    return modPaths.map((mod) => this.loadMod(path.join(this.options.modDir, mod)));
  }

  /**
   * Load and parse the manifest file for a specifid mod located at the speified path.
   *
   * @param modPath The path to the mod directory the mod is located at.
   *
   * @returns The parsed and validated manifest
   */
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

  /**
   * Load a mod from a specified location.
   *
   * @param modPath The path to the directory the mod is located at.
   *
   * @returns The loaded mod.
   */
  private loadMod(modPath: string): Mod {
    const manifest = this.loadModManifest(modPath);
    const entrypointModule = this.loadModModule(modPath, manifest.entrypoint);

    return {
      path: modPath,
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

  /**
   * Load all modules for a mod at a specified location.
   *
   * @param modPath The path to the directory the mod is located at.
   *
   * @returns The loaded modules.
   */
  private loadModModules(modPath: string): ModModule[] {
    const modulePaths = globSync(`${modPath}/**/*.${this.options.modModuleExtension}`);
    return modulePaths.map((modulePath) => this.loadModModule(modPath, path.relative(modPath, modulePath)));
  }

  /**
   * Load a module from a specified location for a mod.
   *
   * @param modPath The path to the directory the mod is located at.
   * @param modulePath The path of the module to load relative to the mod path.
   *
   * @returns The loaded module.
   */
  private loadModModule(modPath: string, modulePath: string): ModModule {
    const modModulePath = path.join(modPath, modulePath);
    const modulePathPosix = modulePath.split(path.sep).join(path.posix.sep);
    const source = fs.readFileSync(modModulePath, 'utf8');

    return {
      name: path.basename(modModulePath),
      specifier: modulePathPosix,
      source: source,
    };
  }
}
