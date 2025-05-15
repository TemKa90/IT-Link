import * as process from 'process';

export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.APP_PORT,
  db: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production' ? 'all' : ['error'],
    autoLoadEntities: true,
  },
});

export const config = configuration();
