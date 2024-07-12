import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config/dist/config.module";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./config/typeorm.config";
import { HttpModule } from "@nestjs/axios";
import { HttpConfigService } from "./config/http.config";
import { OrderModule } from "./module/order/order.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
    OrderModule,
  ],
})
export class AppModule {}
