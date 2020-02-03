import { ServerConfig } from '@uqt/data';

export function createMongoConnectionString(config: ServerConfig): string {
  if (config.production) {
    if (!config.database.connectionString) {
      console.error('No DataBase connection string provided');
    }
    return config.database.connectionString;
  } else {
    return `mongodb://${config.database.user}:${config.database.pass}@${config.database.host}:${config.database.port}`;
  }
}
