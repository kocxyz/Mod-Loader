import type { GUID } from '@/guid-generator';

export type Icon = {
  packageGUID: GUID;
  import: {
    path: string;
    extension: string;
  };
};
