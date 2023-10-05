import type { SandboxAPIModule } from '../mod-evaluator';

const LoggingAPIModule: SandboxAPIModule = {
  createModule: () => ({
    name: 'logging',
    content: `
const logging = {
  log: (args) => {
    __host__api__log(args);
  }
};

export default logging;
    `,
  }),

  initializeSandboxAPI(sandbox) {
    sandbox.global.setSync('__host__api__log', console.log);
  },
};

export default LoggingAPIModule;
