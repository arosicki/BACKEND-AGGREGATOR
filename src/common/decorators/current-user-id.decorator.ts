import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator((context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  return req.user.sub;
});
