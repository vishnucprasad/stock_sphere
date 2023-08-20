import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() === 'http') {
      const authentication = context.switchToHttp().getRequest()
        .cookies?.Authentication;

      if (!authentication) {
        throw new UnauthorizedException(
          'No token was provided for authentication',
        );
      }

      context.switchToHttp().getRequest().Authentication = authentication;

      return authentication;
    }
  }
}
