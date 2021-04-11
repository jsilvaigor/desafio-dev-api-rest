import { CanActivate, ExecutionContext } from '@nestjs/common';

export enum Validate {
  PERSON_ID = 'person_id',
}

export class SecondLevelGuard implements CanActivate {
  constructor(private readonly paramToLook: Validate) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.params && request.params[this.paramToLook]) {
      if (this.paramToLook == Validate.PERSON_ID) {
        return request.params[this.paramToLook] === String(request.user.userId);
      }
    }
    return false;
  }
}

export function ValidatePersonId(): SecondLevelGuard {
  return new SecondLevelGuard(Validate.PERSON_ID);
}
