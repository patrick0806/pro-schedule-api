import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { SubscriptionStatus } from '@shared/enums/subscriptionStatus.enum';

import { Business } from './business.entity';
import { Plan } from './plan.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @Column({ name: 'renews_at' })
  renewsAt: Date;

  @Column({ name: 'canceled_at' })
  canceledAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Business, (business) => business.subscription)
  @JoinColumn()
  business: Relation<Business>;

  @ManyToOne(() => Plan, (Plan) => Plan.subscriptions)
  plan: Relation<Plan>;
}
