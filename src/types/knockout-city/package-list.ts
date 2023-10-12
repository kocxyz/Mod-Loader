import type { GUID } from '@/guid-generator';
import type { Collector, PackageListTemplateData, VJsonTemplate } from '@/generation';

export type PackageList = {
  /**
   * The GUID of the package list.
   */
  guid: GUID;
  /**
   * The path where the package list should be generated at.
   *
   * **Note**: Relative to the `out` directory.
   */
  path: string;
  /**
   * The absolute path inside the Viper FS.
   */
  viperFSPath: string;
  /**
   * The template to use for the package list generation.
   */
  template: VJsonTemplate<PackageListTemplateData>;
  /**
   * The entries of the package list.
   */
  entries: Collector<PackageListEntry>;
};

export type PackageListEntry = {
  /**
   * The GUID of the package list entry.
   */
  guid: GUID;
  /**
   * The absolute path inside the Viper FS.
   */
  viperFSPath: string;
};
