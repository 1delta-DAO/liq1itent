import { OrderStatus } from "./order-status.enum";
import { WalletType } from "./wallet-type.enum";

export class Order {
  swapperWallet: string;
  swapperWalletType: WalletType;
  status: OrderStatus;
  nonce: number;
  signature: string;
  created: Date;
  initiateDeadlineBlock: number;
  fillDeadlineBlock: number;
  originChainId: number;
  originToken: string;
  originAmount: number;
  destinationChainId: number;
  destinationToken: string;
  destinationAmount: number;
}
