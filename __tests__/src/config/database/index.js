import fs from 'fs';

const connectionConfig = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  user: process.env.MYSQL_USER || 'root',
  port: process.env.MYSQL_PORT || '3306',
  password: process.env.MYSQL_PASSWORD || '123456789',
  multipleStatements: true,
};

const resetFileBuffer = fs.readFileSync(process.env.RESET_FILE_DB_ABSOLUTE_PATH, { encoding: 'utf-8' });

export {
  connectionConfig,
  resetFileBuffer,
};
