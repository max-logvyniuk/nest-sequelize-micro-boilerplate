import {forwardRef, HttpModule, Module} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {UsersModule} from './users/user.module';
import {AuthModule} from './authorization/auth.module';
// import {User} from './models/user.model';
// import {Sequelize} from 'sequelize-typescript';
// import {databaseProviders} from './providers/database.providers';
import {DatabaseModule} from './database/database.module';

@Module({
  imports: [
    // forwardRef(() => DatabaseModule),
    AuthModule,
    // forwardRef(() => SequelizeModule.forRootAsync({
    //   imports: [
    //       forwardRef(() => AuthModule),
    //       forwardRef(() => ConfigModule),
    //   ],
      // useFactory: async (configService: ConfigService) => {
      //     const sequelize = new Sequelize({
      //         dialect: 'postgres',
      //         // host: configService.get('DB_HOST') || 'localhost',
      //         // port: configService.get('DB_PORT') || 5432,
      //         // username: configService.get('DB_USERNAME') || 'test',
      //         // password: configService.get('DB_PASSWORD') || 'test',
      //         // database: configService.get('DB_NAME') || 'nest_app',
      //         host: configService.get('DB_HOST'),
      //         port: configService.get('DB_PORT'),
      //         username: configService.get('DB_USERNAME'),
      //         password: configService.get('DB_PASSWORD'),
      //         database: configService.get('DB_NAME'),
      //         autoLoadModels: true,
      //         synchronize: true,
      //     });
      //
      //     sequelize.addModels([User]);
      //     await sequelize.sync();
      //     return sequelize;
      //   },
      // inject: [ConfigService],
    // })),
      UsersModule,
  ],
  controllers: [AppController],
  providers: [
      AppService,
      // ...databaseProviders,
  ],
})
export class AppModule {}
