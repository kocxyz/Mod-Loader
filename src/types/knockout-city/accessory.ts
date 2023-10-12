import type { GUID } from '@/guid-generator';
import type { Rarity, Icon } from '@/types';

export type AccessoryType = 'player_icon';
export type Accessory = {
  /**
   * The name of the accessory.
   * 
   * SHOULD be in english.
   */
  name: string;
  /**
   * The GUID of teh accessory.
   * 
   * **Note**: MUST NOT be generated but rather
   * set manually in order for the server and client
   * GUID's to be the same.
   */
  guid: GUID;
  /**
   * The rarity of the accessory.
   */
  rarity: Rarity;
  /**
   * The type of the accessory.
   */
  type: AccessoryType;
  /**
   * The display icon of the accessory.
   */
  icon: Icon;
  /**
   * If the accessory should be included in the initial
   * inventory of every player.
   * 
   * If set to `true` the item will be available to everyone.
   * Else it will not be in anyones inventory by default.
   * 
   * **Note**: Behaviour yet to implement.
   */
  inInitialInventory: boolean;
};
