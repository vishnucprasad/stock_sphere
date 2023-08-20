import { Exclude, Expose, Transform } from 'class-transformer';
import { User } from '../schema';

export class UserDto {
  @Expose()
  @Transform((params) => params.obj._id.toString())
  public readonly _id: string;

  public readonly firstName: string;
  public readonly lastName: string;
  public readonly email: string;
  public readonly phoneNumber: string;

  @Exclude()
  public readonly password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
