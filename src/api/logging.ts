import getLogger from '../logging';
import type { SandboxAPIModule } from '@/types';

const LoggingAPIModule: SandboxAPIModule = {
  createModule: () => ({
    name: 'logging',
    specifier: 'logging',
    content: `
const logging = {
  debug: (message) => {
    __host__api__log_debug(message);
  },
  info: (message) => {
    __host__api__log_info(message);
  },
  warn: (message) => {
    __host__api__log_warn(message);
  },
  error: (message) => {
    __host__api__log_error(message);
  }
};

export default logging;
    `,
  }),

  initializeSandboxAPI(sandbox, mod) {
    const logger = getLogger(mod.manifest.name);

    sandbox.global.setSync('__host__api__log_debug', (message: string) => logger.debug(message));
    sandbox.global.setSync('__host__api__log_info', (message: string) => logger.info(message));
    sandbox.global.setSync('__host__api__log_warn', (message: string) => logger.warn(message));
    sandbox.global.setSync('__host__api__log_error', (message: string) => logger.error(message));
  },
};

export default LoggingAPIModule;
