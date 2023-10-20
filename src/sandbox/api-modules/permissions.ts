import type { SandboxAPIModule } from '@/types';

export const PermissionsAPIModule = (): SandboxAPIModule => ({
  createModule: () => ({
    name: 'permissions',
    specifier: 'permissions',
    source: `
const permissions = {
  hasPermission: (permission) => {
    return __host__api__permissions_has_permission(permission);
  }
};

export default permissions;
    `,
  }),

  initializeSandboxAPI(sandbox, _, __, permissions) {
    sandbox.global.setSync('__host__api__permissions_has_permission', permissions.hasPermission);
  },
});
