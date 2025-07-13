import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PasswordReset } from "@shared/entities/password-reset.entity";

@Injectable()
export class PasswordResetRepository extends Repository<PasswordReset> {
    constructor(private dataSource: DataSource) {
        super(PasswordReset, dataSource.createEntityManager());
    }

    async findByToken(token: string): Promise<PasswordReset | null> {
        return this.findOne({ where: { token } });
    }

    async findByEmail(email: string): Promise<PasswordReset | null> {
        return this.findOne({ where: { email } });
    }
}
