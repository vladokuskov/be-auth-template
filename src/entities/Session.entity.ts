import {BaseEntity} from '@/entities/Base.entity';
import {Column, Entity} from 'typeorm';

@Entity('sessions')
export class Session extends BaseEntity {
  @Column({type: 'text'})
  userId: string;

  @Column({type: 'date'})
  expiresAt: Date;
}
