import { NestFactory, Reflector } from "@nestjs/core";
import { ApplicationModule } from "./application.module";
import { JwtAuthGuard } from "./modules/auth/auth.jwt.guard";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
    const application = await NestFactory.create(ApplicationModule);
    application.enableCors({
        allowedHeaders: ["content-type", "Authorization"],
        origin: "http://localhost:8080",
        credentials: true,
    });
    const reflector = application.get(Reflector);
    application.useGlobalGuards(new JwtAuthGuard(reflector));
    application.use(cookieParser());
    await application.listen(3000);
}
bootstrap();
