import { Injectable } from "@nestjs/common";
import { OrderService } from "../../order/service/order.service";
import { OrderStatus } from "../../../model/order-status.enum";
import {
  blockchainsConfig,
  findWorkingRpc,
} from "../../../config/blockchains.config";
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
      const orderPayload = this.orderToPayload(order);
      console.log(orderPayload);
      const res = await settlement.initiate(orderPayload, "0x", "0x");
      console.log(res);
    }
  }

  private orderToPayload(order: Order): OrderLib.CrossChainOrderStruct {
    return {
      settlementContract: this.padAddress(
        blockchainsConfig[order.originChainId].settlementAddress
      ),
      swapper: this.padAddress(order.swapperWallet),
      nonce: order.nonce,
      originChainId: order.originChainId,
      initiateDeadline: order.initiateDeadlineBlock,
      fillDeadline: order.fillDeadlineBlock,
      destinationChainId: order.destinationChainId,
      destinationReceiver: this.padAddress(order.swapperWallet),
      destinationSettlementContract: this.padAddress(
        blockchainsConfig[order.destinationChainId].settlementAddress
      ),
      originToken: this.padAddress(order.originToken),
      originAmount: order.originAmount,
      destinationToken: this.padAddress(order.destinationToken),
      destinationAmount: order.destinationAmount,
    };
  }

  private padAddress(address: string): string {
    return address.replace("0x", "0x000000000000000000000000");
  }
}
