import { ConfigService } from "@nestjs/config";
import { BootstrapOptions } from "../shared/interface/BootstrapOptions";

export const serverOptions = async (
  configService: ConfigService
): Promise<BootstrapOptions> => {
  const useHelmet = configService.get("SERVER_HELMET");
  const useSwagger = configService.get("SERVER_SWAGGER");
  const rateLimit = configService.get("SERVER_RATE_LIMIT");

  const useCors = configService.get<string>("CORS");
  const corsOrigin = configService.get("CORS_ORIGIN");
  const corsLocalHost = configService.get("CORS_LOCALHOST");

  return {
    helmet: useHelmet === "yes",
    rateLimit: +rateLimit,
    swagger: useSwagger === "yes",
    cors:
      useCors === "yes"
        ? {
            origin: corsOrigin,
            localHost: corsLocalHost,
          }
        : false,
  };
};
