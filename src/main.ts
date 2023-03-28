import { NestFactory, Reflector } from "@nestjs/core";
import { ApplicationModule } from "./application.module";
import { JwtAuthGuard } from "./modules/auth/auth.jwt.guard";

async function bootstrap() {
    const application = await NestFactory.create(ApplicationModule);
    application.enableCors();
    const reflector = application.get(Reflector);
    application.useGlobalGuards(new JwtAuthGuard(reflector));
    await application.listen(3000);
}
bootstrap();
