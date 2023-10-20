import { ModLoader, ModEvaluator, OutGenerator, type EvaluationResult } from 'knockoutcity-mod-loader';

const main = async () => {
  const loader = new ModLoader();
  const mods = loader.loadMods();

  const evaluationResults: EvaluationResult[] = [];
  for (const mod of mods) {
    const evaluator = new ModEvaluator(mod, {
      modsConfigDir: 'generated/configs',
      permissionsFilePath: 'generated/permissions.yaml',
    });
    evaluationResults.push(await evaluator.evaulate());
  }

  const outGenerator = new OutGenerator({ baseDir: 'generated' });
  await outGenerator.generate(evaluationResults);
};

main();
