import type { GUID } from '@/guid-generator';

export type Package = {
  /**
   * The GUID of the package.
   */
  guid: GUID;
  /**
   * The path where the package should be generated at.
   *
   * **Note**: Relative to the `out` directory.
   */
  path: string;
  /**
   * The absolute path inside the Viper FS.
   */
  viperFSPath: string;
};
