import {PrimaryKey, Property} from '@mikro-orm/core';
import {v4} from 'uuid';

export abstract class BaseEntity {
  @PrimaryKey({type: 'uuid'})
  id: string = v4();

  @Property()
  createdAt = new Date();

  @Property({onUpdate: () => new Date()})
  updatedAt = new Date();
}
