import { ModLoader, ModEvaluator, OutGenerator } from 'knockoutcity-mod-loader';

const main = async () => {
  const loader = new ModLoader();
  const mods = loader.loadMods();

  for (const mod of mods) {
    const evaluator = new ModEvaluator(mod, { permissionsFilePath: 'generated/permissions.yaml' });
    await evaluator.evaulate();
  }

  const outGenerator = new OutGenerator({ baseDir: 'generated' });
  await outGenerator.generate();
};

main();
