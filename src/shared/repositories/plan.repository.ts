import { Injectable } from "@nestjs/common";
import { Plan } from "@shared/entities/plan.entity";
import { IPageResponse } from "@shared/interfaces/repository.interface";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class PlanRepository {
    private repository: Repository<Plan>;

    constructor(private datasource: DataSource) {
        this.repository = datasource.getRepository(Plan);
    }

    async save(plan: Partial<Plan>): Promise<Plan> {
        return this.repository.save(plan);
    }

    async findById(id: string): Promise<Plan> {
        return this.repository.findOne({
            where: {
                id,
            },
            relations: {
                subscriptions: true
            }
        })
    }

    async list(page: number, size: number): Promise<IPageResponse<Plan>> {
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