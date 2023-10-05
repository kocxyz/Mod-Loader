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
  initializeSandboxAPI(sandbox: Sandbox, mod: Mod): void;
};

type ModEvaluatorOptions = {
  modsConfigDir: string;
};

export class ModEvaluator {
  private mod: Mod;
  private sandbox: Sandbox;
  private apiModules: SandboxAPIModule[];
  private options: ModEvaluatorOptions;

  constructor(mod: Mod, options?: Partial<ModEvaluatorOptions>, apiModules?: SandboxAPIModule[]) {
    this.mod = mod;
    this.options = {
      modsConfigDir: 'configs',
      ...options,
    };
    this.apiModules = apiModules ?? [ConfigAPIModule({ modsConfigDir: this.options.modsConfigDir }), LoggingAPIModule];
    this.sandbox = this.createSandbox();
  }

  async evaulate() {
    const sandboxModules: { [name: string]: ModModule } = {
      ...this.mod.modules,
      ...this.apiModules.reduce((acc, sandboxModule) => {
        const module = sandboxModule.createModule();
        sandboxModule.initializeSandboxAPI(this.sandbox, this.mod);

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
