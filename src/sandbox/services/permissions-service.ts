import { ModPermissionsSchema, PermissionsSchema, type Mod, type ModPermissions, type ModPermission } from '@/types';
import { defaultInstance } from '@/zod-util';
import { generateErrorMessage } from 'zod-error';
import fs from 'fs';
import yaml from 'js-yaml';
import lodash from 'lodash';

const DEFAULT_PERMISSIONS: ModPermissions = defaultInstance(ModPermissionsSchema);

type PermissionsServiceOptions = {
  /**
   * The path to the mods permission file.
   */
  permissionsFilePath: string;
};

export class PermissionsService {
  private mod: Mod;
  private options: PermissionsServiceOptions;
  private permissions: ModPermissions | undefined;

  constructor(mod: Mod, options: PermissionsServiceOptions) {
    this.mod = mod;
    this.options = options;
  }

  loadPermissions() {
    if (this.permissions) {
      return;
    }

    const permissionsFilePathStat = fs.statSync(this.options.permissionsFilePath, { throwIfNoEntry: false });
    // Check if the file already exists
    // if so do nothing.
    if (permissionsFilePathStat && !permissionsFilePathStat.isFile()) {
      throw Error(`Directory found instead of file at '${this.options.permissionsFilePath}'`);
    }

    if (!permissionsFilePathStat) {
      fs.writeFileSync(this.options.permissionsFilePath, '');
    }

    const permissionsFileContent = yaml.load(fs.readFileSync(this.options.permissionsFilePath, 'utf-8'));
    const parseResult = PermissionsSchema.safeParse(permissionsFileContent);

    if (!parseResult.success) {
      throw Error(
        `'${
          this.options.permissionsFilePath
        }' is not valid. The following parsing issues occured: ${generateErrorMessage(parseResult.error.errors)}`
      );
    }

    this.permissions = parseResult.data[this.mod.manifest.name] ?? DEFAULT_PERMISSIONS;
  }

  hasPermission(permission: ModPermission): boolean {
    if (!this.permissions) {
      throw Error("No permissions loaded! Did you forget to call 'loadPermissions'?");
    }

    return lodash.get(this.permissions, permission) === true;
  }
}
