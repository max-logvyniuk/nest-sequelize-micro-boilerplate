import { Sequelize } from 'sequelize-typescript';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

// const sequelize = new Sequelize({
//     database: process.env.DB_NAME,
//     // // repositoryMode: true,
//     dialect: 'postgres',
//     host: process.env.DB_HOST,
//     // port: process.env.DB_PORT,
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     // autoLoadModels: true,
//     // synchronize: true,
//     models: [`${__dirname}/src/models`],
// });

const database: any = {};
//
let sequelize: any;
if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      repositoryMode: true,
      dialectOptions: {
        ssl: true,
        native: true,
      },
    },
    // {
    //   dialect: 'postgres',
    //   protocol: 'postgres',
    //   dialectOption: {
    //     ssl: true,
    //     native: true,
    //   },
    // }
);

} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      dialect: 'postgres',
      protocol: 'postgres',
      repositoryMode: true,
      dialectOptions: {
        // ssl: true,
        native: true,
      },
    },
    // config,
  );
}

database.sequelize = sequelize;
database.Sequelize = Sequelize;

// console.info('database ---', database);

export default database;
