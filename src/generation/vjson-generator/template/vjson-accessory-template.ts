import type { GUID } from '@/guid-generator';
import { VJsonTemplate } from './vjson-template';
import { AccessoryType, Rarity } from '@/types';

export type AccessoryTemplateData = {
  guid: GUID;
  viperFSPath: string;
  name: string;
  rarity: `k_rarity_${Rarity}`;
  type: `k_accessory_type_${AccessoryType}`;
  iconPackageGuid: string;
  inInitialInventory: 'true' | 'false';
};
export const AccessoryVJsonTemplate = new VJsonTemplate<AccessoryTemplateData>('accessory.template');
