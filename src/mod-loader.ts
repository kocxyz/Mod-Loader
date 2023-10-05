import fs from 'fs';
import path from 'path';

type ModLoaderConfiguration = {
  baseDir: string;
  mods: {
    modDir: string;
    configDir: string;
  };
};

export type ModModule = {
  name: string;
  content: string;
};

export type Mod = {
  name: string;
  description?: string;
  author?: string;

  entrypoint: ModModule;
  modules: { [name: string]: ModModule };
};

export class ModLoader {
  private configuration: ModLoaderConfiguration;

  constructor(configuration: Partial<ModLoaderConfiguration> = {}) {
    this.configuration = {
      baseDir: '.',
      mods: {
        modDir: 'mods',
        configDir: 'configs',
        ...configuration.mods,
      },
      ...configuration,
    };
  }

  loadMods(): Mod[] {
    const modsPath = path.join(this.configuration.baseDir, this.configuration.mods.modDir);
    const modPaths = fs.readdirSync(modsPath);
    return modPaths.map((mod) => this.loadMod(path.join(modsPath, mod)));
  }

  private loadMod(modPath: string): Mod {
    const entrypointModule = this.loadModModule(path.join(modPath, 'mod.js'));
    return {
      name: 'mod',
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
