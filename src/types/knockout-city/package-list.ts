import type { GUID } from '@/guid-generator';
import type { Collector, PackageListTemplateData, VJsonTemplate } from '@/generation';

export type PackageList = {
  guid: GUID;
  path: string;
  viperFSPath: string;
  template: VJsonTemplate<PackageListTemplateData>;
  entries: Collector<PackageListEntry>;
};

export type PackageListEntry = {
  guid: GUID;
  viperFSPath: string;
};
