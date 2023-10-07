import type { GUID } from '@/guid-generator';
import type { PackageList } from '@/types';
import fs from 'fs';
import path from 'path';
import { VJsonGenerator } from '@/generation';

export const PackageListVJsonGenerator: VJsonGenerator<PackageList> = {
  createFiles: async (outDir, collector) => {
    for (const packageList of collector.getElements()) {
      const entries = packageList.entries.getElements().reduce(
        (acc, cur) => {
          acc.guids.push(cur.guid);
          acc.viperFSPaths.push(cur.viperFSPath);
          return acc;
        },
        { guids: [] as GUID[], viperFSPaths: [] as string[] }
      );

      const fileContent = await packageList.template.getContents({
        guid: packageList.guid,
        viperFSPath: packageList.viperFSPath,
        guids: entries.guids,
        viperFSPaths: entries.viperFSPaths,
      });

      fs.mkdirSync(path.dirname(packageList.path), { recursive: true });
      fs.writeFileSync(packageList.path, fileContent);
    }
  },
};
