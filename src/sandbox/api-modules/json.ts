import type { SandboxAPIModule } from '@/types';

export const JsonAPIModule = (): SandboxAPIModule => ({
  createModule: () => ({
    name: 'json',
    specifier: 'json',
    source: `
const json = {
  stringify: (input) => {
    return __host__api__json_stringify(input);
  },
  parse: (input) => {
    return __host__api__json_parse(input);
  }
};

export default json;
    `,
  }),

  initializeSandboxAPI(sandbox) {
    sandbox.global.setSync('__host__api__json_stringify', JSON.stringify);
    sandbox.global.setSync('__host__api__json_parse', JSON.parse);
  },
});
