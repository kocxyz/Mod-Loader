import type { Mod, ModModule } from '@/types/mod';
import type PermissionsService from '@/services/permissions-service';
import type ivm from 'isolated-vm';

export type Sandbox = {
  isolate: ivm.Isolate;
  context: ivm.Context;
  global: ivm.Reference<Record<string | number | symbol, any>>;
};

export type SandboxAPIModule = {
  createModule(): ModModule;
  initializeSandboxAPI(sandbox: Sandbox, mod: Mod, permissionsService: PermissionsService): void;
};
