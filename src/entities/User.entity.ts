import {BaseEntity} from '@/entities/Base.entity';
import {Column, Entity} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({type: 'text'})
  email: string;

  @Column({type: 'text'})
  username: string;

  @Column({type: 'text'})
  password: string;
}
