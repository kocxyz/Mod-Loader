import type { GUID } from '@/guid-generator';
import type { Rarity, Icon } from '@/types';

export type AccessoryType = 'player_icon';
export type Accessory = {
  name: string;
  guid: GUID;

  rarity: Rarity;
  type: AccessoryType;

  icon: Icon;
  inInitialInventory: boolean;
};
