import type { Mod } from '@/types';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

type ModConfigurationServiceOptions = {
  /**
   * The path to the mods configuration directory.
   */
  configDir: string;
};

export class ModConfigurationService {
  private mod: Mod;
  private options: ModConfigurationServiceOptions;

  constructor(mod: Mod, options: ModConfigurationServiceOptions) {
    this.mod = mod;
    this.options = options;
  }

  getConfiguration<T extends object>(configurationName: string): T | undefined {
    const configurationPath = this.getConfigurationPath(configurationName);
    const configurationPathStat = fs.statSync(configurationPath);

    // Check if the file exists
    // if not we cant parse and read it.
    if (!configurationPathStat.isFile()) {
      return undefined;
    }

    const fileContent = fs.readFileSync(configurationPath, 'utf-8');
    return yaml.load(fileContent) as T;
  }

  createConfiguration<T extends object>(configurationName: string, content: T): boolean {
    const configurationPath = this.getConfigurationPath(configurationName);
    const configurationPathStat = fs.statSync(configurationPath, { throwIfNoEntry: false });

    // Check if the file already exists
    // if so do nothing.
    if (configurationPathStat && configurationPathStat.isFile()) {
      return false;
    }

    fs.mkdirSync(this.getModConfigurationFolderPath(), { recursive: true });
    fs.writeFileSync(configurationPath, yaml.dump(content), {});
    return true;
  }

  private sanitizeConfigurationName(configurationName: string): string {
    return path.basename(configurationName.replaceAll(' ', '_').toLocaleLowerCase());
  }

  private getModConfigurationFolderPath() {
    return path.join(this.options.configDir, this.mod.manifest.name);
  }

  private getConfigurationPath(configurationName: string): string {
    return path.join(this.getModConfigurationFolderPath(), `${this.sanitizeConfigurationName(configurationName)}.yaml`);
  }
}
