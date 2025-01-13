import {BaseEntity} from '@/entities/Base.entity';
import {Column, Entity} from 'typeorm';

@Entity('password_resets')
export class PasswordReset extends BaseEntity {
  @Column({type: 'text'})
  userId: string;

  @Column({type: 'text'})
  token: string;

  @Column({type: 'date'})
  expiresAt: Date;

  @Column({type: 'boolean', default: false})
  used: boolean;

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
