import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { CreateUserRequest, UserDto } from './dto';
import { UserRepository } from './repository';
import { User } from './schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  public async createUser(request: CreateUserRequest) {
    await this.validateCreateUserRequest(request);
    const user = await this.userRepo.create({
      ...request,
      password: await hash(request.password),
    });
    return new UserDto(user);
  }

  private async validateCreateUserRequest(request: CreateUserRequest) {
    let user: User;
    try {
      user = await this.userRepo.findOne({ email: request.email });
    } catch (_) {}

    if (user) {
      throw new UnprocessableEntityException(
        `Email ${request.email} is already exists`,
      );
    }
  }

  public async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({ email });
    const passwordIsValid = await verify(user.password, password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }

  public async getUser(args: Partial<User>) {
    return await this.userRepo.findOne(args);
  }
}
