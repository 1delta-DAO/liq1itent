import dotenv, { DotenvConfigOutput } from 'dotenv';

interface IndexObject {
  [name: string]: string;
}

type EnvType = 'development' | 'production' | 'testing';

const envs: { [key in EnvType]: string } = {
  development: './environments/.env.development',
  production: './environments/.env.production',
  testing: './environments/.env.testing',
};

export const getEnvConfig = (): IndexObject => {
  const env = (process.env['NODE_ENV'] || 'development') as EnvType;
  const configPath = envs[env];

  const configResult: DotenvConfigOutput = dotenv.config({ path: configPath });
  let stringifiedEnvVariables: IndexObject = {};

  if (configResult.parsed) {
    stringifiedEnvVariables = Object.keys(configResult.parsed).reduce(
      (previous: IndexObject, next: string): IndexObject => ({
        ...previous,
        [`process.env.${next}`]: JSON.stringify((configResult.parsed as IndexObject)[next]),
      }),
      {}
    );
  }

  return stringifiedEnvVariables;
};
