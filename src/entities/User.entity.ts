import {BaseEntity} from '@/entities/BaseEntity.entity';
import {Entity, Property} from '@mikro-orm/core';

@Entity({tableName: 'users'})
export class User extends BaseEntity {
  @Property()
  email!: string;

  @Property()
  username!: string;

  @Property()
  password!: string;

  constructor({email, username, password}: Partial<User>) {
    super();
    this.email = email!;
    this.username = username!;
    this.password = password!;
  }
}
