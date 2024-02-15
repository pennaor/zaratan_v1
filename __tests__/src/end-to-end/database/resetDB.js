import * as config from '../../config';

export default async function resetDB(dbPool) {
  await dbPool.query(
  `DROP DATABASE IF EXISTS zaratan_dev;
    CREATE DATABASE zaratan_dev;
    USE zaratan_dev;`
  );
  await dbPool.query(config.database.resetFileBuffer);
}
