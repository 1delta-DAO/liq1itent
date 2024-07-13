import { Injectable, Logger } from "@nestjs/common";
import { Order } from "../../../model/order.model";
import { OrderInput } from "../../../model/order.input";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "../../../model/order.entity";
import { Repository } from "typeorm";
import { OrderUpdateStatusInput } from "../../../model/order-status-update.input";
import { OrderStatus } from "../../../model/order-status.enum";

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRep: Repository<OrderEntity>
  ) {}

  public async ordersGet(status: OrderStatus): Promise<Order[]> {
    this.logger.log(
      "Getting orders" + (status ? " with status " + status : "")
    );
    let orders: OrderEntity[];
    if (status) {
      orders = await this.orderRep.find({ where: { status } });
    } else {
      orders = await this.orderRep.find();
    }
    return orders;
  }

  public async orderCreate(order: OrderInput): Promise<boolean> {
    this.logger.log("Creating order");
    this.orderRep.create(order).save();
    return true;
  }

  public async orderUpdateStatus(
    osu: OrderUpdateStatusInput
  ): Promise<boolean> {
    this.logger.log("Updating order status");
    const res = await this.orderRep.update(osu.id, { status: osu.status });
    return res.affected == null ? false : res.affected > 0;
  }
}
