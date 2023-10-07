import type { GUID } from '@/guid-generator';
import { VJsonTemplate } from './vjson-template';

export type PackageListTemplateData = {
  guid: GUID;
  viperFSPath: string;
  viperFSPaths: string[];
  guids: string[];
};

export const CatchEconomyPackageListVJsonTemplate = new VJsonTemplate<PackageListTemplateData>(
  'catch.economy.package_list.template'
);

export const CatalogManagerPackageListVJsonTemplate = new VJsonTemplate<PackageListTemplateData>(
  'catalog_manager.level.package_list.template'
);

export const ImportPackageListVJsonTemplate = new VJsonTemplate<PackageListTemplateData>(
  'import.package_list.template'
);
