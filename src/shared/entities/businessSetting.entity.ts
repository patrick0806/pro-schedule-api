import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { Business } from "./business.entity";

@Entity('business_settings')
export class BusinessSettings {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('jsonb', { default: () => `'{}'` })
    workingDays: Record<string, boolean>;
    // Example: { "monday": true, "sunday": false }

    @Column('jsonb', { default: () => `'{}'` })
    workingHours: Record<string, { start: string, end: string }>;
    // Example: { "monday": { start: "09:00", end: "18:00" }, ... }

    @Column('jsonb', { default: () => `'{}'` })
    dailyBreaks: Record<string, { start: string, end: string }>;
    // Example: { "monday": { start: "12:00", end: "13:00" }, ... }

    @Column('text', { nullable: true })
    confirmationMessage: string;

    @Column('text', { nullable: true })
    reminderMessage: string;

    @Column('text', { nullable: true })
    cancellationMessage: string;

    @Column('boolean', { default: false })
    autoAcceptAppointments: boolean;

    @Column('text', { nullable: true })
    primaryColor: string;

    @Column('text', { nullable: true })
    logoUrl: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Business, business => business.closures)
    business: Relation<Business>;
}