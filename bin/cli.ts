#!/usr/bin/env node

import 'module-alias/register';

import { Command } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';

console.log(
  chalk.blue(
    figlet.textSync('Mod Loader', {
      font: 'Chunky',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true,
    })
  )
);

const program = new Command();
program
  .name('knockoutcity-mod-loader')
  .description('A CLI tool for loading and getting information about mods for Knockout City')
  .version('1.0.0');

program.command('info', 'Get information about the installed mods', { executableFile: 'commands/info-mods' });

program.command('load', 'Load and evaluate the installed mods', { executableFile: 'commands/load-mods' });

program.parse(process.argv);
