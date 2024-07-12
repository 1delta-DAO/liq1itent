import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { OrderService } from "../service/order.service";
import { OrderInput } from "../../../model/order.input";
import { Order } from "../../../model/order.model";

@Controller("order")
@ApiTags("order")
export class OrderController {
  constructor(private readonly os: OrderService) {}

  @Get("get")
  @ApiOperation({ summary: "Get Orders" })
  async tickerGet(): Promise<Order[]> {
    return this.os.orderFind();
  }

  @Post("create")
  @ApiOperation({ summary: "Create Order" })
  async tickerCreate(@Body() order: OrderInput): Promise<boolean> {
    return this.os.orderCreate(order);
  }
}
