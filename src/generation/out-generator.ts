import path from 'path';
import fs from 'fs';
import {
  AccessoryVJsonGenerator,
  CatchEconomyPackageListVJsonTemplate,
  PackageListVJsonGenerator,
  PackageVJsonGenerator,
  CatalogManagerPackageListVJsonTemplate,
  Collector,
} from '@/generation';
import { GUID } from '@/guid-generator';
import { EvaluationResult, Package, PackageList, PackageListEntry } from '@/types';

type OutGeneratorOptions = {
  /**
   * The path to the directory where the `out` folder and `.viper_root` will be generated.
   *
   * Should be the path to the folder where the `KnockoutCiy.exe` or `KnockoutCityServer.exe`
   * are located.
   */
  baseDir: string;
};

export type GlobalCollectors = {
  economy: Collector<PackageListEntry>;
  catalogManager: Collector<PackageListEntry>;
  packages: Collector<Package>;
  packageLists: Collector<PackageList>;
};

export class OutGenerator {
  private options: OutGeneratorOptions;

  private collectors: GlobalCollectors = {
    economy: new Collector<PackageListEntry>(),
    catalogManager: new Collector<PackageListEntry>(),
    packages: new Collector<Package>(),
    packageLists: new Collector<PackageList>(),
  };

  constructor(options: OutGeneratorOptions) {
    this.options = options;
  }

  /**
   * Generate the overwrite files inside the `baseDir`.
   */
  async generate(results: EvaluationResult[]) {
    fs.mkdirSync(this.options.baseDir, { recursive: true });
    const outDirPath = this.cleanOrCreateOutDir();
    this.createViperRootFile();

    const accessories = new Collector(results.flatMap((result) => result.accessories.getElements()));

    await AccessoryVJsonGenerator.createFiles(outDirPath, accessories, this.collectors);
    await PackageVJsonGenerator.createFiles(outDirPath, this.collectors.packages, this.collectors);

    if (this.collectors.economy.size > 0 || this.collectors.catalogManager.size > 0) {
      this.collectors.packageLists.collect({
        guid: '// NOT NEEDED IN TEMPLATE //' as GUID,
        path: path.join(outDirPath, 'data/catch/commerce/catch.economy.package_list'),
        viperFSPath: '// NOT NEEDED IN TEMPLATE //',
        entries: this.collectors.economy,
        template: CatchEconomyPackageListVJsonTemplate,
      });
      this.collectors.packageLists.collect({
        guid: '// NOT NEEDED IN TEMPLATE //' as GUID,
        path: path.join(outDirPath, 'data/catch/levels/catalog_manager.level.package_list'),
        viperFSPath: '// NOT NEEDED IN TEMPLATE //',
        entries: this.collectors.catalogManager,
        template: CatalogManagerPackageListVJsonTemplate,
      });
    }
    await PackageListVJsonGenerator.createFiles(outDirPath, this.collectors.packageLists, this.collectors);
  }

  /**
   * Clean or create the `out` directory.
   *
   * @returns The path to the out directory.
   */
  private cleanOrCreateOutDir(): string {
    const outDirPath = path.join(this.options.baseDir, 'out');
    fs.rmSync(outDirPath, { recursive: true, force: true });
    fs.mkdirSync(outDirPath, { recursive: true });

    return outDirPath;
  }

  /**
   * Create the `.viper_root` file inside the `baseDir`.
   */
  private createViperRootFile() {
    const viperRootFilePath = path.join(this.options.baseDir, '.viper_root');
    fs.writeFileSync(viperRootFilePath, '');
  }
}
