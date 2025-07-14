import { Injectable } from "@nestjs/common";
import { Service } from "@shared/entities/service.entity";
import { IPageResponse } from "@shared/interfaces/repository.interface";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class ServiceRepository {
    private repository: Repository<Service>;

    constructor(private datasource: DataSource) {
        this.repository = datasource.getRepository(Service);
    }

    async save(service: Partial<Service>): Promise<Service> {
        return this.repository.save(service);
    }

    async findById(id: string): Promise<Service> {
        return this.repository.findOne({
            where: {
                id,
            },
            relations: {
                business: true
            }
        })
    }

    async list(page: number, size: number): Promise<IPageResponse<Service>> {
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
        }
    }

    async deleteById(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async countServicesByBusiness(businessId: string): Promise<number> {
        return this.repository.count({
            where: {
                business: {
                    id: businessId,
                }
            }
        })
    }
}