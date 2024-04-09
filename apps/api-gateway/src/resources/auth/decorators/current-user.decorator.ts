import { ExecutionContext, createParamDecorator } from '@nestjs/common';

const getCurrentUserByContext = (context: ExecutionContext) => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
  // if ((context.getType() as any) === 'graphql') {
  //   const ctx = GqlExecutionContext.create(context);
  //   return ctx.getContext().req.user;
  // }
};

export const CurrentUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const user = getCurrentUserByContext(context);
    return data ? user && user[data] : user;
  },
);
