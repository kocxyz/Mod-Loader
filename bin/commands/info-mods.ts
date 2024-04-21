#!/usr/bin/env node

import { ModLoader } from "@/index";
import commander from "commander";
import chalk from "chalk";

const program = new commander.Command();

program.name("knockoutcity-mod-loader-info-mods");

program
  .option(
    "--mod-dir <path>",
    "The directory where the mods are loacated",
    process.env.KCML_MOD_DIR ?? "mods"
  )
  .option(
    "--manifest-path <path>",
    "The relative path inside the mod where the manifest file is located",
    process.env.KCML_MANIFEST_PATH ?? "manifest.yaml"
  )
  .option(
    "--mod-module-extension <extension>",
    "The mods module file extension",
    process.env.KCML_MOD_MODULE_EXTENSION ?? "js"
  )
  .action((options) => {
    const modLoader = new ModLoader({
      modDir: options.modDir,
      manifestPath: options.manifestPath,
      modModuleExtension: options.modModuleExtension,
    });

    const mods = modLoader.loadMods();
    console.log(chalk.bold(chalk.italic("Installed Mods:")));
    mods.forEach((mod) => {
      console.log(`${mod.manifest.name}: ${mod.manifest.version}`);
    });
  });

program.parse(process.argv);
