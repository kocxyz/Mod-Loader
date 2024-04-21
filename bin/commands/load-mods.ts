#!/usr/bin/env node

import {
  type Mod,
  ModLoader,
  ModEvaluator,
  OutGenerator,
  EvaluationResult,
} from "@/index";
import commander from "commander";
import chalk from "chalk";

const program = new commander.Command();

program.name("knockoutcity-mod-loader-load-mods");

program
  .option(
    "--mod-dir <path>",
    "The directory where the mods are loacated",
    process.env.KCML_MOD_DIR ?? "mods"
  )
  .option(
    "--mod-config-dir <path>",
    "The mods configuration directory",
    process.env.KCML_CONFIG_DIR ?? "config"
  )
  .option(
    "--mod-module-extension <extension>",
    "The mods module file extension",
    process.env.KCML_MOD_MODULE_EXTENSION ?? "js"
  )
  .option(
    "--manifest-path <path>",
    "The relative path inside the mod where the manifest file is located",
    process.env.KCML_MANIFEST_PATH ?? "manifest.yaml"
  )
  .option(
    "--permission-file <path>",
    "The path to the permission file",
    process.env.KCML_PERMISSION_FILE_PATH ?? "permissions.yaml"
  )
  .option(
    "--enabled-mods <list>",
    'A comma seperated list of enabled mods. If not set all mods will be loaded. Also specific versions of a mod can be specified by using "mod-name@version".',
    (value) =>
      value.split(",").reduce((acc, cur) => {
        const [name, version] = cur.split("@");
        return {
          ...acc,
          [name]: version,
        };
      }, {}),
    process.env.KCML_ENABLED_MODS
  )
  .option(
    "--out-dir <path>",
    "The output directory path for the generated files.",
    process.env.KCML_OUT_DIR ?? "out"
  )

  .action(async (options) => {
    const modLoader = new ModLoader({
      modDir: options.modDir,
      manifestPath: options.manifestPath,
      modModuleExtension: options.modModuleExtension,
    });
    const enabledMods: Mod[] = [];
    const mods = modLoader.loadMods();
    console.log(chalk.bold(chalk.italic("Installed Mods:")));
    for (const mod of mods) {
      const enabled = ModLoader.isModEnabled(
        options.enabledMods || {},
        mod.manifest
      );
      if (enabled) {
        enabledMods.push(mod);
      }

      console.log(
        `${mod.manifest.name}: ${mod.manifest.version} (${
          enabled ? chalk.green("enabled") : chalk.red("disabled")
        })`
      );
    }

    console.log("\n");
    console.log(chalk.bold(chalk.italic("Evaluating Mods...")));
    const evaluationResults: EvaluationResult[] = [];
    for (const mod of enabledMods) {
      const evaluator = new ModEvaluator(mod, {
        modsConfigDir: options.modConfigDir,
        permissionsFilePath: options.permissionFile,
      });
      evaluationResults.push(await evaluator.evaulate());
    }

    console.log("\n");
    console.log(chalk.bold(chalk.italic("Generating Files...")));
    const outGenerator = new OutGenerator({ baseDir: options.outDir });
    await outGenerator.generate(evaluationResults);
  });

program.parse(process.argv);
