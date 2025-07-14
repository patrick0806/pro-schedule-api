import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { BusinessClosure } from './businessClosure.entity';
import { BusinessSettings } from './businessSetting.entity';
import { Service } from './service.entity';
import { Subscription } from './subscription.entity';
import { User } from './user.entity';

@Entity('business')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  whatsapp: string;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.business)
  users: Relation<User[]>;

  @OneToOne(() => Subscription, (subscription) => subscription.business)
  subscription: Relation<Subscription>;

  @OneToMany(() => Service, (service) => service.business)
  services: Relation<Service[]>;

  @OneToOne(() => BusinessSettings, { cascade: true })
  settings: Relation<BusinessSettings>;

  @OneToMany(() => BusinessClosure, (closure) => closure.business)
  closures: Relation<BusinessClosure[]>;
}
