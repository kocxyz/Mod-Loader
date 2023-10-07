import type { Accessory, PackageListEntry } from '@/types';
import path from 'path';
import fs from 'fs';
import { generateGUID, NIL_GUID } from '@/guid-generator';
import {
  Collector,
  VJsonGenerator,
  economyPackageListEntryCollector,
  ImportPackageListVJsonTemplate,
  packagesCollector,
  AccessoryVJsonTemplate,
  packageListsCollector,
  catalogManagerPackageListEntryCollector,
} from '@/generation';

export const AccessoryVJsonGenerator: VJsonGenerator<Accessory> = {
  createFiles: async (outDir, collector) => {
    for (const accessory of collector.getElements()) {
      const sanitizedAccessoryFilePathName = accessory.name.toLocaleLowerCase().replaceAll(' ', '_');
      const accessoryFileName = `${sanitizedAccessoryFilePathName}.accessory`;
      const accessoryDir = path.join(outDir, 'data/accessories', sanitizedAccessoryFilePathName);
      const accessoryPath = path.join(accessoryDir, accessoryFileName);
      const accessoryDirViperFSPath = path.join('/out', path.relative(outDir, accessoryDir));
      const accessoryViperFSPath = path.join(accessoryDirViperFSPath, accessoryFileName);

      const fileContent = await AccessoryVJsonTemplate.getContents({
        guid: accessory.guid,
        viperFSPath: accessoryViperFSPath,
        name: accessory.name,
        rarity: `k_rarity_${accessory.rarity}`,
        type: `k_accessory_type_${accessory.type}`,
        iconPackageGuid: accessory.icon.packageGUID,
        inInitialInventory: accessory.inInitialInventory ? 'true' : 'false',
      });

      fs.mkdirSync(accessoryDir, { recursive: true });
      fs.writeFileSync(accessoryPath, fileContent);

      // Create Economy Reference
      economyPackageListEntryCollector.collect({ guid: accessory.guid, viperFSPath: accessoryViperFSPath });
      catalogManagerPackageListEntryCollector.collect({ guid: accessory.guid, viperFSPath: accessoryViperFSPath });

      // .import
      const iconImportName = `${sanitizedAccessoryFilePathName}.${accessory.icon.import.extension}.import`;
      const iconImportPath = path.join(accessoryDir, iconImportName);
      fs.copyFileSync(accessory.icon.import.path, iconImportPath);
      const iconImportViperFSPath = path.join(accessoryDirViperFSPath, iconImportName);

      // .import.package
      const iconImportPackageFileName = `${iconImportName}.package`;
      const iconImportPackagePath = path.join(accessoryDir, iconImportPackageFileName);
      const iconImportPackageViperFSPath = path.join(accessoryDirViperFSPath, iconImportPackageFileName);
      packagesCollector.collect({
        guid: accessory.icon.packageGUID,
        path: iconImportPackagePath,
        viperFSPath: iconImportPackageViperFSPath,
      });
      economyPackageListEntryCollector.collect({
        guid: accessory.icon.packageGUID,
        viperFSPath: iconImportPackageViperFSPath,
      });
      catalogManagerPackageListEntryCollector.collect({
        guid: accessory.icon.packageGUID,
        viperFSPath: iconImportPackageViperFSPath,
      });

      // .import.package_list
      const iconImportPackageListFileName = `${iconImportName}.package_list`;
      const iconImportPackageListPath = path.join(accessoryDir, iconImportPackageListFileName);
      packageListsCollector.collect({
        guid: generateGUID(),
        path: iconImportPackageListPath,
        viperFSPath: path.join(accessoryDirViperFSPath, iconImportPackageListFileName),

        template: ImportPackageListVJsonTemplate,
        entries: new Collector<PackageListEntry>([
          {
            // Import Packages don't have a valid GUID for the
            // .import
            guid: NIL_GUID,
            viperFSPath: iconImportViperFSPath,
          },
        ]),
      });
    }
  },
};
