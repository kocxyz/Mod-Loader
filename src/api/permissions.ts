import type { SandboxAPIModule } from '@/types';

export const PermissionsAPIModule = (): SandboxAPIModule => ({
  createModule: () => ({
    name: 'permissions',
    specifier: 'permissions',
    content: `
const permissions = {
  hasPermission: (permission) => {
    return __host__api__permissions_has_permission(permission);
  }
};

export default permissions;
    `,
  }),

  initializeSandboxAPI(sandbox, _, permissions) {
    sandbox.global.setSync('__host__api__permissions_has_permission', permissions.hasPermission);
  },
});
