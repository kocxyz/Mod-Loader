export type ModModule = {
  name: string;
  content: string;
};

export type Mod = {
  name: string;
  entrypoint: ModModule;
  modules: { [name: string]: ModModule };
};

