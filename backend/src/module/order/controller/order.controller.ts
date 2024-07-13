import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { OrderService } from "../service/order.service";
import { OrderInput } from "../../../model/order.input";
import { Order } from "../../../model/order.model";
import { OrderUpdateStatusInput } from "../../../model/order-status-update.input";
import { OrderStatus } from "../../../model/order-status.enum";

@Controller("order")
@ApiTags("order")
export class OrderController {
  constructor(private readonly os: OrderService) {}

  @Get("get")
  @ApiOperation({ summary: "Get Orders" })
  async ordersGet(@Body() status: OrderStatus): Promise<Order[]> {
    return this.os.ordersGet(status);
  }

  @Post("create")
  @ApiOperation({ summary: "Create Order" })
  async orderCreate(@Body() order: OrderInput): Promise<boolean> {
    return this.os.orderCreate(order);
  }

  @Post("update-status")
  @ApiOperation({ summary: "Update Order Status" })
  async orderUpdateStatus(
    @Body() osu: OrderUpdateStatusInput
  ): Promise<boolean> {
    return this.os.orderUpdateStatus(osu);
  }
}
