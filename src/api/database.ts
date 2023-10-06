import type { SandboxAPIModule } from '@/types';
import ivm from 'isolated-vm';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '@/services/database-service';
import { PrismaModelName, PrismaOperation } from '@/types/database';

const PRISMA_OPERATIONS: PrismaOperation[] = [
  'findUnique',
  'findUniqueOrThrow',
  'findFirst',
  'findFirstOrThrow',
  'findMany',
  'aggregate',
  'groupBy',
  'count',
  'create',
  'createMany',
  'update',
  'updateMany',
  'upsert',
  'delete',
  'deleteMany',
];

const PRISMA_MODEL_NAME: PrismaModelName[] = [
  'allowlisted_users',
  'backends',
  'blocks',
  'brawl_pass',
  'brawl_pass_rewards',
  'commerce_accessories',
  'commerce_codes',
  'commerce_codes_redeemed',
  'commerce_crew_inventory_equipped',
  'commerce_currencies',
  'commerce_funds',
  'commerce_funds_expirations',
  'commerce_inventory_consumables',
  'commerce_inventory_durables',
  'commerce_inventory_durables_inactive',
  'commerce_inventory_equipped',
  'commerce_inventory_initial',
  'commerce_offer_currencies',
  'commerce_offer_item_contents',
  'commerce_offer_items',
  'commerce_offers',
  'commerce_offers_purchased_with_limits',
  'commerce_random_reward_accessories',
  'commerce_random_reward_groups',
  'content_update_files',
  'contract_numerators',
  'contract_progress',
  'contracts',
  'crew_contract_rewards',
  'crew_contracts',
  'crew_contracts_user_rewards',
  'crew_invites',
  'crew_join_requests',
  'crew_members',
  'crews',
  'data_manifest_changelists',
  'data_manifest_packages',
  'data_manifest_platforms',
  'deny_login_period_messages',
  'deny_login_periods',
  'fleet_images',
  'fleet_profiles',
  'friend_requests',
  'friends',
  'ftue_breadcrumbs',
  'inactive_locations',
  'inactive_regions',
  'join_in_progress_players',
  'key_value_pairs',
  'linear_ftue',
  'matchmaking',
  'matchmaking_cooldown',
  'matchmaking_parameters',
  'matchmaking_work',
  'new_news',
  'new_news_item_text',
  'new_news_items',
  'news',
  'news_item_text',
  'news_items',
  'ping_data',
  'playlists',
  'quit_penalties',
  'recent_players',
  'season_leaderboard_rewards',
  'season_rank',
  'season_rewards',
  'settings_global',
  'skill',
  'stats_global',
  'street_rank',
  'street_rank_rewards',
  'user_settings',
  'users',
  'vsql_db_version',
];

const HOST_FUNCTION_PREFIX = '__host__api__database';

const getHostFunctionName = (modelName: PrismaModelName, operation: PrismaOperation) => {
  return `${HOST_FUNCTION_PREFIX}_${modelName}_${operation}`;
};

const generateAPIModuleOperationFunction = (modelName: PrismaModelName, operation: PrismaOperation) => {
  return `
    ${operation}: (args) => {
      return ${getHostFunctionName(modelName, operation)}.applySyncPromise(undefined, args, {}).copy();
    }
  `;
};

const generateAPIModuleObject = (modelName: PrismaModelName) => {
  return `
    ${modelName}: {
      ${PRISMA_OPERATIONS.map((operation) => generateAPIModuleOperationFunction(modelName, operation)).join(',\n')}
    }
  `;
};

const generateHostFunction = <
  Model extends Prisma.TypeMap['meta']['modelProps'],
  Operation extends keyof Prisma.TypeMap['model'][Prisma.TypeMap['meta']['modelProps']]['operations'],
  Args extends Prisma.TypeMap['model'][Model]['operations'][Operation]['args']
>(
  client: any,
  modelName: Model,
  operation: Operation
) => {
  return new ivm.Reference(async function (args: Args) {
    return new ivm.ExternalCopy(await client[modelName][operation](args));
  });
};

export const DatabaseAPIModule = (): SandboxAPIModule => ({
  createModule: () => ({
    name: 'database',
    specifier: 'database',
    content: `
const database = {
  ${PRISMA_MODEL_NAME.map((modelName) => generateAPIModuleObject(modelName)).join(',\n')}
};

export default database;
    `,
  }),

  initializeSandboxAPI(sandbox, _, permission) {
    const database = new DatabaseService(permission);
    const databaseClient = database.createExtendedClient();

    PRISMA_MODEL_NAME.forEach((modelName) => {
      PRISMA_OPERATIONS.forEach((operation) => {
        sandbox.global.setSync(
          getHostFunctionName(modelName, operation),
          generateHostFunction(databaseClient, modelName, operation)
        );
      });
    });
  },
});
