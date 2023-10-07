import type { GUID } from '@/guid-generator';

export type Package = {
  guid: GUID;
  path: string;
  viperFSPath: string;
};
