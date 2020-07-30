import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ApplicationsModule } from './applications/applications.module';
import { LoggerMiddleware } from './log/logger.middleware';
import { UsersModule } from './users/users.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...JSON.parse(process.env.DATABASE_CONFIG!),
      type: 'postgres',
      autoLoadEntities: true,
    }),
    ApplicationsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
