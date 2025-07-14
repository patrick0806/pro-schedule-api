import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Business } from '@shared/entities/business.entity';
import { IPageResponse } from '@shared/interfaces/repository.interface';

@Injectable()
export class BusinessRepository {
  private repository: Repository<Business>;

  constructor(private datasource: DataSource) {
    this.repository = datasource.getRepository(Business);
  }

  async save(business: Partial<Business>): Promise<Business> {
    return this.repository.save(business);
  }

  async findById(id: string): Promise<Business> {
    return this.repository.findOne({
      where: {
        id,
      },
      relations: {
        closures: true,
        settings: true,
        services: true,
      },
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Business> {
    return this.repository.findOne({
      where: {
        whatsapp: phoneNumber,
      },
    });
  }

  async list(page: number, size: number): Promise<IPageResponse<Business>> {
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
