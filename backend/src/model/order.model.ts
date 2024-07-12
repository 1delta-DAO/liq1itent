enum WalletType {
  EVM = "EVM",
  SOL = "SOL",
}

export class Order {
  settlementContract: string;
  swapperWallet: string;
  swapperWalletType: WalletType;
  nonce: number;
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
