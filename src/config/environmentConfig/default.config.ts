import commonConfig from './common-config.json';
import postgresqlCreds from './postgresql-creds.json';
import databricksConfig from './databricks.json';
import externalService from './external-service.json';
import braze from './braze.json';
import airflow from './airflow.json';
import email from './email.json';
import ipwarmupConfig from './ipwarmup-config.json';
import testConfig from './test-config.json';

import fs from 'fs';
import { DataSource } from 'typeorm';

// Create a clone as to not mutate the original JSON file reference
const postgres = { ...postgresqlCreds };

// TODO not sure
// if (process.env.DB_ENV === 'test') {
//   postgres.database += '_test';
//   postgres.username += '_test';
//   postgres.password += '_test';
// }

// Disable SSL for local development
if (process.env.NO_SSL_DB == 'true') {
  postgres['ssl'] = false;
} else {
  // Load the local SSL certificate by default
  // postgres['ssl'] = {
  //   ca: fs
  //     .readFileSync(__dirname + '/../../../rds-combined-ca-bundle.pem')
  //     .toString(),
  // };
}

// export const config = {
//   environment: commonConfig,
//   postgresql: {
//     ...postgres,
//     database: postgres.database,
//     entities: [
//       process.env.NODE_ENV === 'test'
//         ? './src/**/*.entity.ts'
//         : './dist/**/*.entity.js',
//     ],
// subscribers: ['./**/*.subscriber.{ts,js}'],
//   // use migrations when prod
//   migrationsTableName: 'typeorm_migrations',
//     migrations: ['dist/migrations/*.js'],
//       migrationsRun: true,
//         synchronize: false,
//           // logging: 'all',
//           // logger: 'advanced-console', //advanced-console|file
//           autoLoadEntities: true,
//   },

export const config = {
  environment: commonConfig,
  postgresql: {
    type: "sqlite",
    database: "shoppingDB",
    entities: [__dirname + "/**/*.entity{.ts,.js}"],
    synchronize: true
  },

  databricks: {
    ...databricksConfig,
  },
  externalService: {
    ...externalService,
  },
  braze: {
    ...braze,
  },
  airflow: {
    ...airflow,
  },
  email: {
    ...email,
  },
  ipwarmupConfig: {
    ...ipwarmupConfig,
  },
  testConfig: [].slice.call(testConfig),
};

console.log('process.cwd =' + process.cwd()); //// for debuging
console.log('config.postgresql.entities =' + config.postgresql.entities); //// for debuging

// export default dataSource
const source = new DataSource({
  type: "sqlite",
  database: "shoppingDB",
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  synchronize: true
});

//const source = {};

export default source;
