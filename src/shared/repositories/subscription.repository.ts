import { Injectable } from "@nestjs/common";
import { Subscription } from "@shared/entities/subscription.entity";
import { IPageResponse } from "@shared/interfaces/repository.interface";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class SubscriptionRepository {
    private repository: Repository<Subscription>;

    constructor(private datasource: DataSource) {
        this.repository = datasource.getRepository(Subscription);
    }

    async save(subscription: Partial<Subscription>): Promise<Subscription> {
        return this.repository.save(subscription);
    }

    async findById(id: string): Promise<Subscription> {
        return this.repository.findOne({
            where: {
                id,
            },
            relations: {
                business: true,
                plan: true
            }
        })
    }

    async findByBusinessId(businessId: string): Promise<Subscription> {
        return this.repository.findOne({
            where: {
                business: {
                    id: businessId,
                }
            },
            relations: {
                plan: true,
            }
        })
    }

    async list(page: number, size: number): Promise<IPageResponse<Subscription>> {
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