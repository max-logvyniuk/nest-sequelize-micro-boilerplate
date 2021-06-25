import { Sequelize } from 'sequelize-typescript';
import {ConfigService} from '@nestjs/config';

import { User } from '../models/user.model';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async (configService: ConfigService) => {
            const sequelize = new Sequelize({
                dialect: 'postgres',
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                },
                // process.env.DB_NAME,
                // process.env.DB_USERNAME,
                // process.env.DB_PASSWORD,
                // {
                //     dialect: 'postgres',
                //     protocol: 'postgres',
                //     repositoryMode: true,
                //     dialectOptions: {
                //         // ssl: true,
                //         native: true,
                //     },
                // },
                //     {
                //     dialect: 'postgres',
                //     host: configService.get('DB_HOST'),
                //     port: configService.get('DB_PORT'),
                //     username: configService.get('DB_USERNAME'),
                //     password: configService.get('DB_PASSWORD'),
                //     database: configService.get('DB_NAME'),
                // }
            );

            sequelize.authenticate().then(() => {
                console.info('Connection has been established successfully!');
            }).catch(error => {
                console.info('Unable to connect to database - ', error);
            });

            sequelize.addModels([User]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
