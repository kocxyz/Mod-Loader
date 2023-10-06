import z from 'zod';
import { PrismaModelName } from './database';

type DotPath<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${DotPath<T[K]> extends never ? '' : `.${DotPath<T[K]>}`}`;
    }[keyof T]
  : never;

export type ModDatabaseTablePermission = keyof ModDatabaseTablePermissions;
export type ModDatabaseTablePermissions = z.infer<typeof ModDatabaseTablePermissionsSchema>;
const ModDatabaseTablePermissionsSchema = z
  .object({
    read: z.boolean().optional().default(false),
    write: z.boolean().optional().default(false),
    delete: z.boolean().optional().default(false),
  })
  .strict();

const ModDatabaseTablePermission = ModDatabaseTablePermissionsSchema.optional().default({});
export type ModDatabasePermissions = z.infer<typeof ModDatabasePermissionsSchema>;
const ModDatabasePermissionsSchema = z
  .object({
    allowlisted_users: ModDatabaseTablePermission,
    backends: ModDatabaseTablePermission,
    blocks: ModDatabaseTablePermission,
    brawl_pass: ModDatabaseTablePermission,
    brawl_pass_rewards: ModDatabaseTablePermission,
    commerce_accessories: ModDatabaseTablePermission,
    commerce_codes: ModDatabaseTablePermission,
    commerce_codes_redeemed: ModDatabaseTablePermission,
    commerce_crew_inventory_equipped: ModDatabaseTablePermission,
    commerce_currencies: ModDatabaseTablePermission,
    commerce_funds: ModDatabaseTablePermission,
    commerce_funds_expirations: ModDatabaseTablePermission,
    commerce_inventory_consumables: ModDatabaseTablePermission,
    commerce_inventory_durables: ModDatabaseTablePermission,
    commerce_inventory_durables_inactive: ModDatabaseTablePermission,
    commerce_inventory_equipped: ModDatabaseTablePermission,
    commerce_inventory_initial: ModDatabaseTablePermission,
    commerce_offer_currencies: ModDatabaseTablePermission,
    commerce_offer_item_contents: ModDatabaseTablePermission,
    commerce_offer_items: ModDatabaseTablePermission,
    commerce_offers: ModDatabaseTablePermission,
    commerce_offers_purchased_with_limits: ModDatabaseTablePermission,
    commerce_random_reward_accessories: ModDatabaseTablePermission,
    commerce_random_reward_groups: ModDatabaseTablePermission,
    content_update_files: ModDatabaseTablePermission,
    contract_numerators: ModDatabaseTablePermission,
    contract_progress: ModDatabaseTablePermission,
    contracts: ModDatabaseTablePermission,
    crew_contract_rewards: ModDatabaseTablePermission,
    crew_contracts: ModDatabaseTablePermission,
    crew_contracts_user_rewards: ModDatabaseTablePermission,
    crew_invites: ModDatabaseTablePermission,
    crew_join_requests: ModDatabaseTablePermission,
    crew_members: ModDatabaseTablePermission,
    crews: ModDatabaseTablePermission,
    data_manifest_changelists: ModDatabaseTablePermission,
    data_manifest_packages: ModDatabaseTablePermission,
    data_manifest_platforms: ModDatabaseTablePermission,
    deny_login_period_messages: ModDatabaseTablePermission,
    deny_login_periods: ModDatabaseTablePermission,
    fleet_images: ModDatabaseTablePermission,
    fleet_profiles: ModDatabaseTablePermission,
    friend_requests: ModDatabaseTablePermission,
    friends: ModDatabaseTablePermission,
    ftue_breadcrumbs: ModDatabaseTablePermission,
    inactive_locations: ModDatabaseTablePermission,
    inactive_regions: ModDatabaseTablePermission,
    join_in_progress_players: ModDatabaseTablePermission,
    key_value_pairs: ModDatabaseTablePermission,
    linear_ftue: ModDatabaseTablePermission,
    matchmaking: ModDatabaseTablePermission,
    matchmaking_cooldown: ModDatabaseTablePermission,
    matchmaking_parameters: ModDatabaseTablePermission,
    matchmaking_work: ModDatabaseTablePermission,
    new_news: ModDatabaseTablePermission,
    new_news_item_text: ModDatabaseTablePermission,
    new_news_items: ModDatabaseTablePermission,
    news: ModDatabaseTablePermission,
    news_item_text: ModDatabaseTablePermission,
    news_items: ModDatabaseTablePermission,
    ping_data: ModDatabaseTablePermission,
    playlists: ModDatabaseTablePermission,
    quit_penalties: ModDatabaseTablePermission,
    recent_players: ModDatabaseTablePermission,
    season_leaderboard_rewards: ModDatabaseTablePermission,
    season_rank: ModDatabaseTablePermission,
    season_rewards: ModDatabaseTablePermission,
    settings_global: ModDatabaseTablePermission,
    skill: ModDatabaseTablePermission,
    stats_global: ModDatabaseTablePermission,
    street_rank: ModDatabaseTablePermission,
    street_rank_rewards: ModDatabaseTablePermission,
    user_settings: ModDatabaseTablePermission,
    users: ModDatabaseTablePermission,
    vsql_db_version: ModDatabaseTablePermission,
  } satisfies { [K in PrismaModelName]: typeof ModDatabaseTablePermission })
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
