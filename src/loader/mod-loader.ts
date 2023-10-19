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
   * Check if a mod is enabled with the specified {@link enabledMods}.
   *
   * @param enabledMods The enabled mods
   * @param manifest The manifest of the mod to check
   *
   * @returns Wheather or not the mod is enabled
   */
  static isModEnabled(enabledMods: Record<string, string | undefined>, manifest: ModManifest): boolean {
    if (!(manifest.name in enabledMods)) {
      return false;
    }

    const version = enabledMods[manifest.name];
    // Check if a version is specified
    // If it is then the versions have to match
    // Else we can load the mod.
    if (version && version !== manifest.version) {
      return false;
    }

    return true;
  }

  /**
   * Load the mods inside the mods folder.
   *
   * @param enabledMods A object with mod name to version.
   *                    If not specified all mods will be loaded.
   *
   * @example
   * ```typescript
   * // Load all mods
   * loadMods();
   *
   * // Load specific mods
   * loadMods({
   *    // Will load the 'server-config' mod no matter the version.
   *    'server-config': undefined,
   *
   *    // Will load the 'icon' mod but only the version '1.0.2'
   *    // other versions of the mod will not be loaded.
   *    'icon': '1.0.2',
   * });
   * ```
   *
   * @returns The loaded mods
   */
  loadMods(enabledMods?: Record<string, string | undefined>): Mod[] {
    const manifests = this.loadModManifests();

    // Load all mods if none are specifically enabled.
    if (!enabledMods) {
      return manifests.map((meta) => this.loadMod(meta.path));
    }

    return manifests.reduce((loadedMods, modMeta) => {
      if (!ModLoader.isModEnabled(enabledMods, modMeta.manifest)) {
        return loadedMods;
      }

      loadedMods.push(this.loadMod(modMeta.path));
      return loadedMods;
    }, [] as Mod[]);
  }

  /**
   * Load the mod manifests inside the mods folder
   *
   * **Note**: Useful to determine which mods should be enabled.
   *
   * @returns The loaded manifests and mod paths
   */
  loadModManifests(): { manifest: ModManifest; path: string }[] {
    return this.loadModPaths().map((modFolderName) => {
      const modPath = path.join(this.options.modDir, modFolderName);
      return {
        path: modPath,
        manifest: this.loadModManifest(modPath),
      };
    });
  }

  /**
   * Retrive all the mod paths.
   *
   * @returns The mod paths
   */
  private loadModPaths(): string[] {
    return fs.readdirSync(this.options.modDir);
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
   * Load all modules for a mod at a specified location.
   *
   * @param modPath The path to the directory the mod is located at.
   *
   * @returns The loaded modules.
   */
  private loadModModules(modPath: string): ModModule[] {
    const modPathPosix = modPath.split(path.sep).join(path.posix.sep);
    // Glob uses posix paths for globbing. Thus we need to convert
    // a potential windows path to a posix path.
    const modulePaths = globSync(`${modPathPosix}/**/*.${this.options.modModuleExtension}`);
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
