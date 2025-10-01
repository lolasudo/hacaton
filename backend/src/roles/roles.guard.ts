import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<(number | string)[]>(
      'roles',
      [context.getClass(), context.getHandler()],
    );
    
    // ИСПРАВЛЕНИЕ: Добавьте проверку на undefined/null
    if (!roles || !roles.length) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();

    // Дополнительная проверка на существование пользователя и роли
    if (!request.user || !request.user.role) {
      return false;
    }

    return roles.map(String).includes(String(request.user.role.id));
  }
}