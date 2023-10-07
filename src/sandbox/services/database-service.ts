import type { ModDatabaseTablePermission, ModPermission } from '@/types';
import { PermissionsService } from '@/sandbox/services';
import { prisma } from '@/prisma';
import { PrismaModelName, PrismaOperation } from '@/types/database';

export class DatabaseService {
  private permissions: PermissionsService;

  constructor(permissions: PermissionsService) {
    this.permissions = permissions;
  }

  createExtendedClient() {
    return prisma.$extends({
      query: {
        $allModels: {
          $allOperations: ({ model, operation, args, query }) => {
            const permission = this.getPermissionForModelOperation(model, operation);
            if (!this.permissions.hasPermission(permission)) {
              throw Error(`Permission denied: ${permission}`);
            }
            return query(args);
          },
        },
      },
    });
  }

  private getPermissionForOperation(operation: PrismaOperation): ModDatabaseTablePermission {
    switch (operation) {
      case 'findUnique':
      case 'findUniqueOrThrow':
      case 'findFirst':
      case 'findFirstOrThrow':
      case 'findMany':
      case 'aggregate':
      case 'groupBy':
      case 'count':
        return 'read';

      case 'create':
      case 'createMany':
      case 'update':
      case 'updateMany':
      case 'upsert':
        return 'write';

      case 'delete':
      case 'deleteMany':
        return 'delete';
    }
  }

  private getPermissionForModelOperation(model: PrismaModelName, operation: PrismaOperation): ModPermission {
    return `database.${model}.${this.getPermissionForOperation(operation)}`;
  }
}
