import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BusinessSettings } from '@shared/entities/businessSetting.entity';
import { IPageResponse } from '@shared/interfaces/repository.interface';

@Injectable()
export class BusinessSettingsRepository {
  private repository: Repository<BusinessSettings>;

  constructor(private datasource: DataSource) {
    this.repository = datasource.getRepository(BusinessSettings);
  }

  async save(
    businessSettings: Partial<BusinessSettings>,
  ): Promise<BusinessSettings> {
    return this.repository.save(businessSettings);
  }

  async findById(id: string): Promise<BusinessSettings> {
    return this.repository.findOne({
      where: {
        id,
      },
      relations: {
        business: true,
      },
    });
  }

  async list(
    page: number,
    size: number,
  ): Promise<IPageResponse<BusinessSettings>> {
    const [results, totalResults] = await this.repository.findAndCount({
      skip: (page - 1) * size,
      take: size,
    });

    return {
      page,
      size,
      totalElements: totalResults,
      totalPages: Math.ceil(totalResults / size),
      content: results,
    };
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
