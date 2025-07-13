import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1752368119968 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.query(`
            CREATE TABLE "plans" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" text NOT NULL,
                "price" integer NOT NULL,
                "team_limit" integer NOT NULL,
                "appointment_limit" integer NOT NULL,
                "service_limit" integer NOT NULL,
                "is_active" boolean NOT NULL,
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now()
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "business" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" text NOT NULL,
                "whatsapp" text NOT NULL,
                "is_active" boolean NOT NULL,
                "timezone" text DEFAULT 'America/Sao_Paulo',
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now()
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" text NOT NULL,
                "email" text NOT NULL UNIQUE,
                "password" text NOT NULL,
                "role" text NOT NULL,
                "is_active" boolean NOT NULL,
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now(),
                "businessId" uuid REFERENCES business(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "subscriptions" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "status" text NOT NULL,
                "renews_at" TIMESTAMP NOT NULL,
                "canceled_at" TIMESTAMP,
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now(),
                "businessId" uuid UNIQUE REFERENCES business(id),
                "planId" uuid REFERENCES plans(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "services" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" text NOT NULL,
                "price" integer NOT NULL,
                "duration" integer NOT NULL,
                "is_active" boolean NOT NULL,
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now(),
                "businessId" uuid REFERENCES business(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "business_settings" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "workingDays" jsonb DEFAULT '{}',
                "workingHours" jsonb DEFAULT '{}',
                "dailyBreaks" jsonb DEFAULT '{}',
                "confirmationMessage" text,
                "reminderMessage" text,
                "cancellationMessage" text,
                "autoAcceptAppointments" boolean DEFAULT false,
                "primaryColor" text,
                "logoUrl" text,
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now(),
                "businessId" uuid UNIQUE REFERENCES business(id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "business_closures" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "start" TIMESTAMP NOT NULL,
                "end" TIMESTAMP NOT NULL,
                "reason" text,
                "created_at" TIMESTAMP DEFAULT now(),
                "businessId" uuid REFERENCES business(id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "business_closures"`);
        await queryRunner.query(`DROP TABLE "business_settings"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "business"`);
        await queryRunner.query(`DROP TABLE "plans"`);
    }

}
