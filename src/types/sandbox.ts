import type { Mod, ModModule, Accessory, PackageListEntry } from '@/types';
import type { PermissionsService } from '@/sandbox/services';
import type { Collector } from '@/generation/collector';
import type ivm from 'isolated-vm';

/**
 * A representation of a sandbox environment.
 */
export type Sandbox = {
  isolate: ivm.Isolate;
  context: ivm.Context;
  global: ivm.Reference<Record<string | number | symbol, any>>;
};

/**
 * A representation of a Sandbox API Module.
 */
export type SandboxAPIModule = {
  /**
   * Create the sandbox module.
   */
  createModule(): ModModule;
  /**
   * Initialise the Sandbox Module API Methods.
   *
   * @param sandbox The sandbox to initialise in.
   * @param mod The mod that will be evaluated in the sandbox.
   * @param permissionsService A permission service instance for the mod.
   */
  initializeSandboxAPI(
    sandbox: Sandbox,
    mod: Mod,
    result: EvaluationResult,
    permissionsService: PermissionsService
  ): void;
};

export type EvaluationResult = {
  accessories: Collector<Accessory>;
};
