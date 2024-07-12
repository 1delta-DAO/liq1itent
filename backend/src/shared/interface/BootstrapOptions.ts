import { CorsConfig } from "./CorsConfig";

export interface BootstrapOptions {
  rateLimit: number;
  helmet: boolean;
  swagger: boolean;
  cors?: CorsConfig | false;
}
