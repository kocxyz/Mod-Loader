import type { GUID } from '@/guid-generator';
import { VJsonTemplate } from './vjson-template';

export type PackageTemplateData = {
  guid: GUID;
  viperFSPath: string;
};
export const PackageVJsonTemplate = new VJsonTemplate<PackageTemplateData>('package.template');
