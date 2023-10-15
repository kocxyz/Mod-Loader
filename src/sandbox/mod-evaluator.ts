import type { Sandbox, SandboxAPIModule, Mod, ModModule } from '@/types';
import ivm from 'isolated-vm';
import path from 'path';
import fs from 'fs';
import {
  ConfigAPIModule,
  LoggingAPIModule,
  JsonAPIModule,
  PermissionsAPIModule,
  DatabaseAPIModule,
} from '@/sandbox/api-modules';
import { PermissionsService } from '@/sandbox/services';
import { AccessoriesAPIModule } from './api-modules/accessories';
import { prisma } from '@/prisma';

type ModEvaluatorOptions = {
  /**
   * The path to the folder where mod configuration files should be stored.
   *
   * @default `configs`
   */
  modsConfigDir: string;
  /**
   * The path to the permissions file.
   *
   * @default `permissions.yml`
   */
  permissionsFilePath: string;
};

export class ModEvaluator {
  private mod: Mod;
  private permissionService: PermissionsService;
  private sandbox: Sandbox;
  private apiModules: SandboxAPIModule[];
  private options: ModEvaluatorOptions;

  constructor(mod: Mod, options?: Partial<ModEvaluatorOptions>) {
    this.mod = mod;
    this.options = {
      modsConfigDir: 'configs',
      permissionsFilePath: 'permissions.yml',
      ...options,
    };
    this.permissionService = new PermissionsService(mod, { permissionsFilePath: this.options.permissionsFilePath });
    this.apiModules = [
      ConfigAPIModule({ modsConfigDir: this.options.modsConfigDir }),
      LoggingAPIModule(),
      JsonAPIModule(),
      PermissionsAPIModule(),
      DatabaseAPIModule(),
      AccessoriesAPIModule(),
    ];
    this.sandbox = this.createSandbox();
  }

  async evaulate() {
    await prisma.$connect();

    fs.mkdirSync(this.options.modsConfigDir, { recursive: true });
    fs.mkdirSync(path.dirname(this.options.permissionsFilePath), { recursive: true });

    this.permissionService.loadPermissions();

    const sandboxAPIModules: { [specifier: string]: ModModule } = {
      ...this.apiModules.reduce((acc, sandboxModule) => {
        const module = sandboxModule.createModule();
        sandboxModule.initializeSandboxAPI(this.sandbox, this.mod, this.permissionService);

        return {
          [module.specifier]: module,
          ...acc,
        };
      }, {}),
    };

    const modEntrypointModule = this.sandbox.isolate.compileModuleSync(this.mod.entrypoint.source);
    this.instantiateModule(this.mod.manifest.entrypoint, modEntrypointModule, sandboxAPIModules);
    return modEntrypointModule.evaluate({ promise: true });
  }

  private instantiateModule(
    modulePath: string,
    module: ivm.Module,
    sandboxAPIModules: { [specifier: string]: ModModule }
  ): void {
    module.instantiateSync(this.sandbox.context, (specifier) => {
      const resolvedModulePath = path.join(path.dirname(modulePath), specifier);
      const module =
        sandboxAPIModules[specifier] ??
        this.mod.modules[resolvedModulePath] ??
        this.mod.modules[`${resolvedModulePath}.js`];

      if (!module) {
        throw Error(
          `Could not resolve module '${specifier}'. Absolut path: '${resolvedModulePath}' or ${resolvedModulePath}.js`
        );
      }

      const innerModule = this.sandbox.isolate.compileModuleSync(module.source);
      this.instantiateModule(resolvedModulePath, innerModule, sandboxAPIModules);
      return innerModule;
    });
  }

  private createSandbox(): Sandbox {
    const isolate = new ivm.Isolate();
    const context = isolate.createContextSync();

    const global = context.global;
    global.setSync('global', global.derefInto());

    return {
      isolate,
      context,
      global,
    };
  }
}
