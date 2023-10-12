import type { GUID } from '@/guid-generator';

export type Icon = {
  /**
   * The GUID for the icon package.
   */
  packageGUID: GUID;
  import: {
    /**
     * The path to the import file
     */
    path: string;
    /**
     * The original file extension of the data included
     * in the import file.
     */
    extension: string;
  };
};
