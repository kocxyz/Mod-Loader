import type { SandboxAPIModule } from '../mod-evaluator';
import ModConfigurationService from '../services/config-service';

type ConfigAPIModuleOptions = {
  modsConfigDir: string;
};

const ConfigAPIModule = (options: ConfigAPIModuleOptions): SandboxAPIModule => ({
  createModule: () => ({
    name: 'config',
    content: `
const config = {
  read: (name) => {
    return __host__api__read_config(name);
  },
  createDefault: (name, content) => {
    return __host__api__create_default(name, content);
  }
};

export default config;
    `,
  }),

  initializeSandboxAPI(sandbox, mod) {
    const configurationService = new ModConfigurationService(mod, { configDir: options.modsConfigDir });

    sandbox.global.setSync('__host__api__read_config', <T extends object>(configurationName: string) => {
      return configurationService.getConfiguration<T>(configurationName);
    });

    sandbox.global.setSync(
      '__host__api__create_default',
      <T extends object>(configurationName: string, content: T): boolean => {
        return configurationService.createConfiguration(configurationName, content);
      }
    );
  },
});

export default ConfigAPIModule;
