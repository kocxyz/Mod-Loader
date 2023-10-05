import type { Sandbox, SandboxAPIModule, Mod, ModModule } from '@/types';
import ivm from 'isolated-vm';
import path from 'path';
import ConfigAPIModule from './api/config';
import LoggingAPIModule from './api/logging';

type ModEvaluatorOptions = {
  modsConfigDir: string;
};

export class ModEvaluator {
  private mod: Mod;
  private sandbox: Sandbox;
  private apiModules: SandboxAPIModule[];
  private options: ModEvaluatorOptions;

  constructor(mod: Mod, options?: Partial<ModEvaluatorOptions>) {
    this.mod = mod;
    this.options = {
      modsConfigDir: 'configs',
      ...options,
    };
    this.apiModules = [ConfigAPIModule({ modsConfigDir: this.options.modsConfigDir }), LoggingAPIModule];
    this.sandbox = this.createSandbox();
  }

  async evaulate() {
    const sandboxAPIModules: { [specifier: string]: ModModule } = {
      ...this.apiModules.reduce((acc, sandboxModule) => {
        const module = sandboxModule.createModule();
        sandboxModule.initializeSandboxAPI(this.sandbox, this.mod);

        return {
          [module.specifier]: module,
          ...acc,
        };
      }, {}),
    };

    const modEntrypointModule = this.sandbox.isolate.compileModuleSync(this.mod.entrypoint.content);
    this.instantiateModule('.', modEntrypointModule, sandboxAPIModules);
    return modEntrypointModule.evaluate({ promise: true });
  }

  private instantiateModule(
    modulePath: string,
    module: ivm.Module,
    sandboxAPIModules: { [specifier: string]: ModModule }
  ): void {
    module.instantiateSync(this.sandbox.context, (specifier) => {
      const resolvedModulePath = path.join(path.dirname(modulePath), specifier);
      const module = sandboxAPIModules[specifier] ?? this.mod.modules[resolvedModulePath];

      if (!module) {
        throw Error(`Could not resolve module '${specifier}'. Absolut path: '${resolvedModulePath}'`);
      }

      const innerModule = this.sandbox.isolate.compileModuleSync(module.content);
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
