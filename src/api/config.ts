import type { SandboxAPIModule } from '../mod-evaluator';
import ivm from 'isolated-vm';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const ConfigAPIModule: SandboxAPIModule = {
  createModule: () => ({
    name: 'config',
    content: `
const config = {
  read: (name) => {
    const result = __host__api__read_config.applySyncPromise(undefined, [name], {});
    return result.copy();
  },
  createDefault: (name, content) => {
    const result = __host__api__create_default.applySyncPromise(undefined, [name, content], {});
    return result.copy(); 
  }
};

export default config;
    `,
  }),

  initializeSandboxAPI(sandbox) {
    sandbox.global.setSync(
      '__host__api__read_config',
      new ivm.Reference(async function (...args: any) {
        await delay(1000);
        return new ivm.ExternalCopy(args);
      })
    );

    sandbox.global.setSync(
      '__host__api__create_default',
      new ivm.Reference(async function (...args: any) {
        await delay(1000);
        return new ivm.ExternalCopy(args);
      })
    );
  },
};

export default ConfigAPIModule;
