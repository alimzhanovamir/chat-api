import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AccessTokenStrategy } from "src/modules/auth/strategies/access-token.strategy";

export interface AuthRequest extends Request {
    user: Awaited<ReturnType<AccessTokenStrategy["validate"]>>;
}

export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const { user } = ctx.switchToHttp().getRequest<AuthRequest>();
        return user;
    },
);
