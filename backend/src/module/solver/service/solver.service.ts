import { Injectable } from "@nestjs/common";
import { OrderService } from "../../order/service/order.service";
import { OrderStatus } from "../../../model/order-status.enum";
import { findWorkingRpc } from "../../../config/blockchains.config";
import { getSettlementContract } from "../../../shared/blockchain/settlement.contract";
import { OrderLib } from "../../../types/Settlement";
import { Order } from "../../../model/order.model";
import { ethers } from "ethers";

@Injectable()
export class SolverService {
  constructor(private readonly os: OrderService) {}

  async solveOrders() {
    const orders = await this.os.ordersGet(OrderStatus.NEW);

    for (const order of orders) {
      console.log(order);
      const rpc = await findWorkingRpc(order.originChainId);
      const settlement = getSettlementContract(order.originChainId, rpc);
      // await settlement.initiate(
      //   this.orderToPayload(order),
      //   order.signature,
      //   ""
      // );
    }
  }

  private orderToPayload(order: Order): OrderLib.CrossChainOrderStruct {
    return {
      settlementContract: order.settlementContract,
      swapper: order.swapperWallet,
      nonce: order.nonce,
      originChainId: order.originChainId,
      initiateDeadline: order.initiateDeadlineBlock,
      fillDeadline: order.fillDeadlineBlock,
      destinationChainId: order.destinationChainId,
      destinationReceiver: order.destinationToken,
      destinationSettlementContract: ethers.utils.randomBytes(32),
      originToken: order.originToken,
      originAmount: order.originAmount,
      destinationToken: order.destinationToken,
      destinationAmount: order.destinationAmount,
    };
  }
}
