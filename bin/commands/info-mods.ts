#!/usr/bin/env node

import 'module-alias/register';

import { ModLoader } from '@/index';
import commander from 'commander';
import chalk from 'chalk';

const program = new commander.Command();

program.name('knockoutcity-mod-loader-info-mods');

program
  .option('--mod-dir <path>', 'The directory where the mods are loacated', 'mods')
  .option(
    '--manifest-path <path>',
    'The relative path inside the mod where the manifest file is located',
    'manifest.yaml'
  )
  .option('--mod-module-extension <extension>', 'The mods module file extension', 'js')
  .action((options) => {
    const modLoader = new ModLoader({
      modDir: options.modDir,
      manifestPath: options.manifestPath,
      modModuleExtension: options.modModuleExtension,
    });

    const mods = modLoader.loadMods();
    console.log(chalk.bold(chalk.italic('Installed Mods:')));
    mods.forEach((mod) => {
      console.log(`${mod.manifest.name}: ${mod.manifest.version}`);
    });
  });

program.parse(process.argv);