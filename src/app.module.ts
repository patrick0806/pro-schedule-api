import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { JWTAuthGuard, RolesGuard } from '@shared/guards';

import { AuthModule } from '@modules/auth/auth.module';
import { HealthModule } from '@modules/health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from '@config/typeorm/datasource';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...databaseOptions }),
    HealthModule,
    AuthModule,
    RouterModule.register([
      {
        path: 'health',
        module: HealthModule,
      },
      {
        path: 'auth',
        module: AuthModule,
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
export class AppModule { }
