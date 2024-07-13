import { Injectable } from "@nestjs/common";
import { OrderService } from "../../order/service/order.service";
import { OrderStatus } from "../../../model/order-status.enum";
import { findWorkingRpc } from "../../../config/blockchains.config";
import { getSettlementContract } from "../../../shared/blockchain/settlement.contract";
import { OrderLib } from "../../../types/Settlement";
import { Order } from "../../../model/order.model";
import { ethers } from "ethers";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SolverService {
  constructor(
    private readonly os: OrderService,
    private configService: ConfigService
  ) {}

  async solveOrders() {
    const orders = await this.os.ordersGet(OrderStatus.NEW);

    for (const order of orders) {
      console.log(order);
      const rpc = await findWorkingRpc(order.originChainId);
      const pk = this.configService.get("WALLET_PK");
      const signer = new ethers.Wallet(pk, ethers.getDefaultProvider(rpc));
      const settlement = getSettlementContract(order.originChainId, signer);
      if (!settlement) {
        console.log(
          "No settlement contract found for chainId",
          order.originChainId
        );
        continue;
      }

      console.log("signer", signer);
      settlement.connect(signer);
      const res = await settlement.initiate(
        this.orderToPayload(order),
        order.signature,
        ""
      );

      console.log(res);
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
