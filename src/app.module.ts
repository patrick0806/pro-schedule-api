import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseOptions } from '@config/typeorm/datasource';

import { JWTAuthGuard, RolesGuard } from '@shared/guards';

import { AuthModule } from '@modules/auth/auth.module';
import { HealthModule } from '@modules/health/health.module';
import { ServiceModule } from '@modules/service/service.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...databaseOptions }),
    HealthModule,
    AuthModule,
    ServiceModule,
    RouterModule.register([
      {
        path: 'health',
        module: HealthModule,
      },
      {
        path: 'auth',
        module: AuthModule,
      },
      {
        path: 'service',
        module: ServiceModule,
      },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JWTAuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
