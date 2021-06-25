import {Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {UsersModule} from './users/user.module';
import {AuthModule} from './authorization/auth.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
      AppService,
  ],
})
export class AppModule {}
