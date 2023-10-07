import path from 'path';
import fs from 'fs';
import { PackageVJsonTemplate, VJsonGenerator } from '@/generation';
import { Package } from '@/types';

export const PackageVJsonGenerator: VJsonGenerator<Package> = {
  createFiles: async (_, collector) => {
    for (const vJsonPackage of collector.getElements()) {
      const fileContent = await PackageVJsonTemplate.getContents({
        guid: vJsonPackage.guid,
        viperFSPath: vJsonPackage.viperFSPath,
      });

      fs.mkdirSync(path.dirname(vJsonPackage.path), { recursive: true });
      fs.writeFileSync(vJsonPackage.path, fileContent);
    }
  },
};
