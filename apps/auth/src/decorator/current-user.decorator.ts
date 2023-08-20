import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user/schema';

export const getCurrentUserByContext = (context: ExecutionContext): User => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData().user;
  }
};

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => getCurrentUserByContext(context),
);
