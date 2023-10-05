import z from 'zod';

type DotPath<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${DotPath<T[K]> extends never ? '' : `.${DotPath<T[K]>}`}`;
    }[keyof T]
  : never;

export type ModDatabaseTablePermissions = z.infer<typeof ModDatabaseTablePermissionsSchema>;
const ModDatabaseTablePermissionsSchema = z
  .object({
    read: z.boolean().optional().default(false),
    write: z.boolean().optional().default(false),
    delete: z.boolean().optional().default(false),
  })
  .strict();

export type ModDatabasePermissions = z.infer<typeof ModDatabasePermissionsSchema>;
const ModDatabasePermissionsSchema = z
  .object({
    news: ModDatabaseTablePermissionsSchema.optional().default({}),
  })
  .strict();

export type ModPermissions = z.infer<typeof ModPermissionsSchema>;
export type ModPermission = DotPath<ModPermissions>;
export const ModPermissionsSchema = z
  .object({
    database: ModDatabasePermissionsSchema.optional().default({}),
  })
  .strict();

export type Permissions = z.infer<typeof PermissionsSchema>;
export const PermissionsSchema = z.record(z.string().min(1), ModPermissionsSchema).default({});
