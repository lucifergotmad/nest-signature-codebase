import { Types } from 'mongoose';
import { Guard } from '../../logic/guard';
import { DateVO } from 'src/core/value-object/date.value-object';
import { IId } from 'src/core/interface/id.interface';

export interface BaseEntityProps {
  created_at: DateVO;
}

export interface RawBaseEntityProps {
  created_at: Date;
}

export abstract class Entity<EntityProps> {
  protected props: EntityProps;
  protected _created_at: DateVO;
  protected _id: Types.ObjectId;

  constructor(props: EntityProps, _id?: Types.ObjectId) {
    this.validateProps(props);
    const now = DateVO.now();
    this.props = props;
    this._created_at = now;
    this._id = _id ?? new Types.ObjectId();
  }

  get created_at(): DateVO {
    return this._created_at;
  }

  public static isEntity(entity: unknown): entity is Entity<unknown> {
    return entity instanceof Entity;
  }

  public get propsCopy(): EntityProps & RawBaseEntityProps & IId {
    const propsCopy = {
      _id: this._id,
      created_at: this._created_at.value,
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }

  private validateProps(props: EntityProps) {
    if (Guard.isEmpty(props)) {
      throw new Error('Entity props should not be empty!');
    }
    if (typeof props !== 'object') {
      throw new Error('Entity props should be an object');
    }
  }
}
