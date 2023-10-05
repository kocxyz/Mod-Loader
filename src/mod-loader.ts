import type { Mod, ModModule } from '@/types';
import fs from 'fs';
import path from 'path';

type ModLoaderOptions = {
  modDir: string;
};

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
