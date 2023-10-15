#!/usr/bin/env node

import 'module-alias/register';

import { type Mod, ModLoader, ModEvaluator, OutGenerator } from '@/index';
import commander from 'commander';
import chalk from 'chalk';

const program = new commander.Command();

program.name('knockoutcity-mod-loader-info-mods');

program
  .option('--mod-dir <path>', 'The directory where the mods are loacated', 'mods')
  .option('--mod-config-dir <path>', 'The mods configuration directory', 'config')
  .option('--mod-module-extension <extension>', 'The mods module file extension', 'js')
  .option(
    '--manifest-path <path>',
    'The relative path inside the mod where the manifest file is located',
    'manifest.yaml'
  )
  .option('--permission-file <path>', 'The path to the permission file', 'permissions.yaml')
  .option('--enabled-mods <list>', 'A comma seperated list of enabled mods. If not set all mods will be loaded.', (value) =>
    value.split(',')
  )
  .option('--out-dir <path>', 'The output directory path for the generated files.', 'out')

  .action(async (options) => {
    const modLoader = new ModLoader({
      modDir: options.modDir,
      manifestPath: options.manifestPath,
      modModuleExtension: options.modModuleExtension,
    });

    const mods = modLoader.loadMods();
    const enabledMods: Mod[] = [];
    console.log(chalk.bold(chalk.italic('Installed Mods:')));
    mods.forEach((mod) => {
      const enabled = options.enabledMods?.includes(mod.manifest.name) ?? true;
      console.log(
        `${mod.manifest.name}: ${mod.manifest.version} (${enabled ? chalk.green('enabled') : chalk.red('disabled')})`
      );
      if (enabled) enabledMods.push(mod);
    });

    console.log('\n');
    console.log(chalk.bold(chalk.italic('Evaluating Mods...')));
    for (const mod of enabledMods) {
      const evaluator = new ModEvaluator(mod, {
        modsConfigDir: options.modConfigDir,
        permissionsFilePath: options.permissionFile,
      });
      await evaluator.evaulate();
    }

    console.log('\n');
    console.log(chalk.bold(chalk.italic('Generating Files...')));
    const outGenerator = new OutGenerator({ baseDir: options.outDir });
    await outGenerator.generate();
  });

program.parse(process.argv);