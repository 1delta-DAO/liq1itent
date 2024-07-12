import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { bootstrapServer } from "./shared/util/bootstrapServer";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await bootstrapServer(app);
  await app.listen(app.get(ConfigService).get("SERVER_PORT"));
}

bootstrap();
