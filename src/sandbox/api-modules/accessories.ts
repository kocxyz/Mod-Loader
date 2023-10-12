import { accessoriesCollector } from '@/generation';
import { GUID, generateGUID } from '@/guid-generator';
import type { Accessory, AccessoryType, Rarity, SandboxAPIModule } from '@/types';
import path from 'path';

export const AccessoriesAPIModule = (): SandboxAPIModule => ({
  createModule: () => ({
    name: 'accessories',
    specifier: 'accessories',
    source: `
const accessories = {
  addPlayerIcon: (guid, name, rarity, icon, inInitialInventory = true) => {
    return __host__api__accessories_create(guid, name, 'player_icon', rarity, icon, inInitialInventory);
  }
};

export default accessories;
    `,
  }),

  initializeSandboxAPI(sandbox, mod) {
    sandbox.global.setSync(
      '__host__api__accessories_create',
      (
        guid: GUID,
        name: string,
        type: AccessoryType,
        rarity: Rarity,
        icon: { path: string; extension: string },
        inInitialInventory: boolean
      ) => {
        const iconImportPath = path.join(mod.path, icon.path);

        const accessory: Accessory = {
          guid: guid,
          name: name,
          type: type,
          rarity: rarity,
          icon: {
            import: {
              path: iconImportPath,
              extension: icon.extension,
            },
            packageGUID: generateGUID(),
          },
          inInitialInventory: inInitialInventory,
        };

        accessoriesCollector.collect(accessory);
        return accessory;
      }
    );
  },
});
