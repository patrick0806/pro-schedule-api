import { Module } from '@nestjs/common';

import { ServiceRepository } from '@shared/repositories/service.repository';

import { CreateServiceController } from './contexts/create/create.controller';
import { CreateServiceService } from './contexts/create/create.service';
import { DeleteServiceController } from './contexts/delete/delete.controller';
import { DeleteServiceService } from './contexts/delete/delete.service';
import { EditServiceController } from './contexts/edit/edit.controller';
import { EditServiceService } from './contexts/edit/edit.service';
import { FindServiceController } from './contexts/find/find.controller';
import { FindServiceService } from './contexts/find/find.service';
import { ListServicesController } from './contexts/list/list.controller';
import { ListServicesService } from './contexts/list/list.service';
import { PlanRepository } from '@shared/repositories/plan.repository';

@Module({
  controllers: [
    CreateServiceController,
    EditServiceController,
    DeleteServiceController,
    FindServiceController,
    ListServicesController,
  ],
  providers: [
    CreateServiceService,
    EditServiceService,
    DeleteServiceService,
    FindServiceService,
    ListServicesService,
    ServiceRepository,
    PlanRepository,
  ],
})
export class ServiceModule { }
