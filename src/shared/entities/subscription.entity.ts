import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Business } from "./business.entity";
import { Plan } from "./plan.entity";
import { SubscriptionStatus } from "@shared/enums/subscriptionStatus.enum";

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    status: SubscriptionStatus;

    @Column({ name: 'renews_at' })
    renewsAt: Date;

    @Column({ name: 'canceled_at' })
    canceledAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToOne(() => Business, business => business.subscription)
    @JoinColumn()
    business: Business;

    @ManyToOne(() => Plan, Plan => Plan.subscriptions)
    plan: Plan;
}