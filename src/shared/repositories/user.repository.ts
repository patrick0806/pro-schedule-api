import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { User } from '@shared/entities/user.entity';
import { IPageResponse } from '@shared/interfaces/repository.interface';

@Injectable()
export class UserRepository {
  private repository: Repository<User>;

  constructor(private datasource: DataSource) {
    this.repository = datasource.getRepository(User);
  }

  async save(user: Partial<User>): Promise<User> {
    return this.repository.save(user);
  }

  async findById(id: string): Promise<User> {
    return this.repository.findOne({
      where: {
        id,
      },
      relations: {
        business: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.repository.findOne({
      where: {
        email,
      },
      relations: {
        business: true,
      },
    });
  }

  async list(page: number, size: number): Promise<IPageResponse<User>> {
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
