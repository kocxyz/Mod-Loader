import type { Mod, ModModule } from './mod-loader';
import ivm from 'isolated-vm';
import ConfigAPIModule from './api/config';
import LoggingAPIModule from './api/logging';

type Sandbox = {
  isolate: ivm.Isolate;
  context: ivm.Context;
  global: ivm.Reference<Record<string | number | symbol, any>>;
};

export type SandboxAPIModule = {
  createModule(): ModModule;
  initializeSandboxAPI(sandbox: Sandbox): void;
};

const DEFAULT_API_MODULES = [ConfigAPIModule, LoggingAPIModule];

export class ModEvaluator {
  private mod: Mod;
  private sandbox: Sandbox;
  private apiModules: SandboxAPIModule[];

  constructor(mod: Mod, apiModules: SandboxAPIModule[] = DEFAULT_API_MODULES) {
    this.mod = mod;
    this.apiModules = apiModules;
    this.sandbox = this.createSandbox();
  }

  async evaulate() {
    const sandboxModules: { [name: string]: ModModule } = {
      ...this.mod.modules,
      ...this.apiModules.reduce((acc, sandboxModule) => {
        const module = sandboxModule.createModule();
        sandboxModule.initializeSandboxAPI(this.sandbox);

        return {
          [module.name]: module,
          ...acc,
        };
      }, {}),
    };

    const modEntrypointModule = this.sandbox.isolate.compileModuleSync(this.mod.entrypoint.content);
    modEntrypointModule.instantiateSync(this.sandbox.context, (specifier) =>
      this.sandbox.isolate.compileModuleSync(sandboxModules[specifier].content)
    );

    return modEntrypointModule.evaluate({ promise: true });
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
