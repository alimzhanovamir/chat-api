import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtAuthStrategy } from "src/modules/auth/auth.jwt.strategy";

export interface AuthRequest extends Request {
    user: Awaited<ReturnType<JwtAuthStrategy["validate"]>>;
}

export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const { user } = ctx.switchToHttp().getRequest<AuthRequest>();
        return user;
    },
);