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
import { solidityPack } from "ethers/lib/utils";

const defaultAdapterParams = solidityPack(["uint16", "uint256"], [1, 200000]);

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
      const sourceChainRpc = await findWorkingRpc(order.originChainId);
      const destinationChainRpc = await findWorkingRpc(
        order.destinationChainId
      );
      const pk = this.configService.get("WALLET_PK");
      const signer = new ethers.Wallet(
        pk,
        ethers.getDefaultProvider(sourceChainRpc)
      );
      const settlementSourceChain = getSettlementContract(
        order.originChainId,
        signer
      );
      const settlementDestinationChain = getSettlementContract(
        order.destinationChainId,
        signer
      );

      if (!settlementSourceChain) {
        console.log(
          "No settlement contract found for chainId",
          order.originChainId
        );
        continue;
      }
      const orderPayload = this.orderToPayload(order);
      console.log("Calling settlement.initiate with", orderPayload);
      const res = await settlementSourceChain.initiate(
        orderPayload,
        order.signature,
        "0x"
      );
      console.log(res);

      // Define native fee and quote for the message send operation
      let nativeFee = 0n;

      // const options = Options.newOptions().addExecutorLzReceiveOption(650000, 0).toHex().toString()
      // const testMessage = solidityPacked(['bytes32', 'bytes32'], [getHash(orderSample), padAddress(operator.address)])
      // try {
      //   [nativeFee] = await settlementDestinationChain.quote.staticCall(
      //     ENDPOINT_IDS[ChainId.MANTLE],
      //     testMessage,
      //     options,
      //     false
      //   );
      // } catch (e: any) {
      //   console.log(e.data);
      // }

      settlementDestinationChain.settle(
        this.padAddress(signer.address),
        orderPayload,
        defaultAdapterParams,
        { value: nativeFee }
      );
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
      originAmount: BigInt(order.originAmount),
      destinationToken: this.padAddress(order.destinationToken),
      destinationAmount: BigInt(order.destinationAmount),
    };
  }

  private padAddress(address: string): string {
    return address.replace("0x", "0x000000000000000000000000");
  }
}
