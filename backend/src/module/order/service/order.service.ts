import { Injectable, Logger } from "@nestjs/common";
import { Order } from "../../../model/order.model";
import { OrderInput } from "../../../model/order.input";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "../../../model/order.entity";
import { Repository } from "typeorm";

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRep: Repository<OrderEntity>
  ) {}

  public async orderFind(): Promise<Order[]> {
    this.logger.log("Finding orders");
    const orders = await this.orderRep.find();
    console.log(orders);
    return orders;
  }

  public async orderCreate(order: OrderInput): Promise<boolean> {
    this.logger.log("Creating order");
    this.orderRep.create(order).save();
    return true;
  }
}
