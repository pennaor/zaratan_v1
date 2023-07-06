import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

function readEnv(pathToEnv) {
  return dotenv.parse(fs.readFileSync(pathToEnv, { encoding: 'utf-8' }));
}

function parseEnv(env, targetKeys) {
  return targetKeys.reduce((newEnv, key) => {
    if (!env[key]) {
      throw new Error(`Key ${key} not found in env file`);
    }
    newEnv[key] = env[key];
    return newEnv;
  }, {});
}

function populateEnv(absolutePath, targetKeys) {
  const env = readEnv(path.resolve(absolutePath, '.env'));
  const newEnv = parseEnv(env, targetKeys);
  dotenv.populate(process.env, newEnv);
}

(function init() {
  if (process.env.TESTS_ENV === 'docker') {
    return
  };

  dotenv.config();

  if (!process.env.FRONTEND_ABSOLUTE_PATH) {
    throw new Error('env FRONTEND_ABSOLUTE_PATH not found');
  }
  if (!process.env.BACKEND_ABSOLUTE_PATH) {
    throw new Error('env BACKEND_ABSOLUTE_PATH not found');
  }
  if (!process.env.RESET_FILE_DB_ABSOLUTE_PATH) {
    throw new Error('env RESET_DB_FILE_PATH not found');
  }

  const frontEndTargetKeys = ['REACT_APP_HOST', 'REACT_APP_PORT'];
  const backEndTargetKeys = ['MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_HOST', 'MYSQL_PORT', 'MYSQL_DATABASE'];

  populateEnv(process.env.FRONTEND_ABSOLUTE_PATH, frontEndTargetKeys);
  populateEnv(process.env.BACKEND_ABSOLUTE_PATH, backEndTargetKeys);
})();
