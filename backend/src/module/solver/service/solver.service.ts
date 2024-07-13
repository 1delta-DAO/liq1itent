import { Injectable } from "@nestjs/common";
import { OrderService } from "../../order/service/order.service";
import { OrderStatus } from "../../../model/order-status.enum";

@Injectable()
export class SolverService {
  constructor(private readonly os: OrderService) {}

  async solveOrders() {
    const orders = await this.os.ordersGet(OrderStatus.NEW);

    for (const order of orders) {
      console.log(order);
    }
  }
}
