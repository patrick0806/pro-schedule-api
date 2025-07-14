import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { Business } from './business.entity';

@Entity('business_closures')
export class BusinessClosure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Business, (business) => business.id)
  business: Relation<Business>;

  @Column({ name: 'start', type: 'timestamp' })
  start: Date;

  @Column({ name: 'end', type: 'timestamp' })
  end: Date;

  @Column({ nullable: true })
  reason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
