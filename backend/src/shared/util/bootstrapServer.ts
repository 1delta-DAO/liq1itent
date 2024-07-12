import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { serverOptions } from "../../config/server.options";

export const bootstrapServer = async (
  app: INestApplication
): Promise<INestApplication> => {
  app.use(bodyParser.text());
  const options = await serverOptions(app.get(ConfigService));

  if (options.helmet) {
    // TODO: Turn contentSecurityPolicy on in production
    app.use(
      helmet({
        contentSecurityPolicy:
          process.env.NODE_ENV === "production" ? undefined : false,
      })
    );
  }

  const env = app.get(ConfigService).get("SERVER_ENV");
  app.useLogger(
    env === "development"
      ? ["log", "debug", "error", "verbose", "warn"]
      : ["log", "error", "warn"]
  );

  if (options.cors) {
    const corsOriginList = [options.cors.origin];

    if (options.cors.localHost && options.cors.localHost != "") {
      corsOriginList.push(options.cors.localHost);
    }

    app.enableCors({
      origin: corsOriginList,
    });
  }

  if (options.rateLimit) {
    app.use(
      rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: options.rateLimit, // limit each IP to an amount of requests per windowMs
      })
    );
  }

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
    })
  );

  if (options.swagger) {
    const config = new DocumentBuilder()
      .setTitle("Liqu1tent")
      .setDescription("Liqu1tent, omnichain omnilang liquidity aggregator")
      .setVersion("1.0")
      .addTag("liqu1tent")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);
  }

  return app;
};
