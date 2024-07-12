import { Injectable, Logger } from "@nestjs/common";
import { Order } from "../../../model/order.model";
import { OrderInput } from "../../../model/order.input";

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor() {}

  public async orderFind(): Promise<Order[]> {
    this.logger.log("Finding orders");
    return [];
  }

  public async orderCreate(order: OrderInput): Promise<boolean> {
    this.logger.log("Creating order");
    return true;
  }
}
