import {BaseEntity} from '@/entities/BaseEntity.entity';
import {Entity, Property} from '@mikro-orm/core';

@Entity({tableName: 'sessions'})
export class Session extends BaseEntity {
  @Property()
  userId!: string;

  @Property()
  expiresAt!: Date;

  constructor({userId, expiresAt}: Partial<Session>) {
    super();
    this.userId = userId!;
    this.expiresAt = expiresAt!;
  }
}
