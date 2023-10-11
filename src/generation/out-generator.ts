import path from 'path';
import fs from 'fs';
import {
  accessoriesCollector,
  economyPackageListEntryCollector,
  packageListsCollector,
  packagesCollector,
  AccessoryVJsonGenerator,
  CatchEconomyPackageListVJsonTemplate,
  PackageListVJsonGenerator,
  PackageVJsonGenerator,
  catalogManagerPackageListEntryCollector,
  CatalogManagerPackageListVJsonTemplate,
} from '@/generation';
import { GUID } from '@/guid-generator';

type OutGeneratorOptions = {
  /**
   * The path to the directory where the `out` folder and `.viper_root` will be generated.
   *
   * Should be the path to the folder where the `KnockoutCiy.exe` or `KnockoutCityServer.exe`
   * are located.
   */
  baseDir: string;
};

export class OutGenerator {
  private options: OutGeneratorOptions;

  constructor(options: OutGeneratorOptions) {
    this.options = options;
  }

  async generate() {
    fs.mkdirSync(this.options.baseDir, { recursive: true });
    const outDirPath = this.cleanOutDir();
    this.createViperRootFile();

    await AccessoryVJsonGenerator.createFiles(outDirPath, accessoriesCollector);

    await PackageVJsonGenerator.createFiles(outDirPath, packagesCollector);

    packageListsCollector.collect({
      guid: '// NOT NEEDED IN TEMPLATE //' as GUID,
      path: path.join(outDirPath, 'data/catch/commerce/catch.economy.package_list'),
      viperFSPath: '// NOT NEEDED IN TEMPLATE //',
      entries: economyPackageListEntryCollector,
      template: CatchEconomyPackageListVJsonTemplate,
    });
    packageListsCollector.collect({
      guid: '// NOT NEEDED IN TEMPLATE //' as GUID,
      path: path.join(outDirPath, 'data/catch/levels/catalog_manager.level.package_list'),
      viperFSPath: '// NOT NEEDED IN TEMPLATE //',
      entries: catalogManagerPackageListEntryCollector,
      template: CatalogManagerPackageListVJsonTemplate,
    });
    await PackageListVJsonGenerator.createFiles(outDirPath, packageListsCollector);
  }

  private cleanOutDir(): string {
    const outDirPath = path.join(this.options.baseDir, 'out');
    fs.rmSync(outDirPath, { recursive: true, force: true });
    fs.mkdirSync(outDirPath, { recursive: true });

    return outDirPath;
  }

  private createViperRootFile() {
    const viperRootFilePath = path.join(this.options.baseDir, '.viper_root');
    fs.writeFileSync(viperRootFilePath, '');
  }
}
