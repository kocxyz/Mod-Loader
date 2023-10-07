import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://kocxyz.github.io',
  base: '/Mod-Loader',
  integrations: [
    // starlightLinksValidator(),
    starlight({
      title: 'KoCity (Modding)',
      logo: {
        replacesTitle: true,
        src: './src/assets/icon.png',
      },
      favicon: 'favicon.png',
      social: {
        github: 'https://github.com/kocxyz',
        discord: 'https://discord.gg/4kNPb4cRxN',
      },
      customCss: [
        // Path to your Tailwind base styles:
        './src/assets/css/tailwind.css',
      ],
      pagination: false,
      tableOfContents: true,
      sidebar: [
        {
          label: 'Guides',
          autogenerate: {
            directory: 'guides',
          },
        },
        {
          label: 'Reference',
          autogenerate: {
            directory: 'reference',
          },
        },
        {
          label: 'Internals Deep Dive',
          collapsed: false,
          items: [
            {
              label: 'Introduction',
              link: '/internals-deep-dive/introduction',
            },
            {
              label: 'Getting Started',
              link: '/internals-deep-dive/getting-started',
            },
            {
              label: 'Create Custom Item',
              link: 'internals-deep-dive/create-custom-item',
            },
            {
              label: 'Reference',
              collapsed: true,
              items: [
                {
                  label: 'VZip',
                  autogenerate: {
                    directory: 'internals-deep-dive/reference/vzip',
                  },
                },
                {
                  label: 'VJson',
                  items: [
                    {
                      label: 'Overview',
                      link: '/internals-deep-dive/reference/vjson/overview',
                    },
                    {
                      label: 'Accessory',
                      link: '/internals-deep-dive/reference/vjson/accessory',
                    },
                    {
                      label: 'Achievement List',
                      link: '/internals-deep-dive/reference/vjson/achievement-list',
                    },
                    {
                      label: 'Contract',
                      link: '/internals-deep-dive/reference/vjson/contract-def',
                    },
                    {
                      label: 'Contract List',
                      link: '/internals-deep-dive/reference/vjson/contract-list',
                    },
                    {
                      label: 'Economy',
                      link: '/internals-deep-dive/reference/vjson/economy',
                    },
                    {
                      label: 'Emote',
                      link: '/internals-deep-dive/reference/vjson/emote-def',
                    },
                    {
                      label: 'Level',
                      link: '/internals-deep-dive/reference/vjson/level',
                    },
                    {
                      label: 'Package List',
                      link: '/internals-deep-dive/reference/vjson/package-list',
                    },
                    {
                      label: 'Reward',
                      link: '/internals-deep-dive/reference/vjson/reward-def',
                    },
                    {
                      label: 'Components',
                      autogenerate: {
                        directory: 'internals-deep-dive/reference/vjson/components',
                      },
                    },
                    {
                      label: 'Localization',
                      autogenerate: {
                        directory: 'internals-deep-dive/reference/vjson/localization',
                      },
                    },
                  ],
                },
                {
                  label: 'SQL',
                  autogenerate: {
                    directory: 'internals-deep-dive/reference/sql',
                  },
                },
              ],
            },
            {
              label: 'Items',
              collapsed: true,
              items: [
                {
                  label: 'Bundles',
                  autogenerate: {
                    directory: 'internals-deep-dive/items/bundles',
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
    tailwind(),
  ],
});
