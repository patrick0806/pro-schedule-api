import { Injectable } from "@nestjs/common";
import { BusinessClosure } from "@shared/entities/businessClosure.entity";
import { IPageResponse } from "@shared/interfaces/repository.interface";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class BusinessClosureRepository {
    private repository: Repository<BusinessClosure>;

    constructor(private datasource: DataSource) {
        this.repository = datasource.getRepository(BusinessClosure);
    }

    async save(businessClosure: Partial<BusinessClosure>): Promise<BusinessClosure> {
        return this.repository.save(businessClosure);
    }

    async findById(id: string): Promise<BusinessClosure> {
        return this.repository.findOne({
            where: {
                id,
            },
            relations: {
                business: true
            }
        })
    }

    async list(page: number, size: number): Promise<IPageResponse<BusinessClosure>> {
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
}