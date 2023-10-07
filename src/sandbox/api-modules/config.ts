import type { SandboxAPIModule } from '@/types';
import { ModConfigurationService } from '@/sandbox/services';

type ConfigAPIModuleOptions = {
  modsConfigDir: string;
};

export const ConfigAPIModule = (options: ConfigAPIModuleOptions): SandboxAPIModule => ({
  createModule: () => ({
    name: 'config',
    specifier: 'config',
    content: `
const config = {
  read: (name) => {
    return __host__api__config_read(name);
  },
  createDefault: (name, content) => {
    return __host__api__config_create_default(name, content);
  }
};

export default config;
    `,
  }),

  initializeSandboxAPI(sandbox, mod) {
    const configurationService = new ModConfigurationService(mod, { configDir: options.modsConfigDir });

    sandbox.global.setSync('__host__api__config_read', <T extends object>(configurationName: string) => {
      return configurationService.getConfiguration<T>(configurationName);
    });

    sandbox.global.setSync(
      '__host__api__config_create_default',
      <T extends object>(configurationName: string, content: T): boolean => {
        return configurationService.createConfiguration(configurationName, content);
      }
    );
  },
});
