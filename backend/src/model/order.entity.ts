import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

enum WalletType {
  EVM = "EVM",
  SOL = "SOL",
}

@Entity({ name: "order" })
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "settlement_contract" })
  settlementContract: string;

  @Column({ name: "swapper_wallet" })
  swapperWallet: string;

  @Column({ name: "swapper_wallet_type" })
  swapperWalletType: WalletType;

  @Column({ name: "nonce" })
  nonce: number;

  @Column({ name: "created", type: "timestamptz" })
  created: Date;

  @Column({ name: "initiate_deadline_block" })
  initiateDeadlineBlock: number;

  @Column({ name: "fill_deadline_block" })
  fillDeadlineBlock: number;

  @Column({ name: "origin_chain_id" })
  originChainId: number;

  @Column({ name: "origin_token" })
  originToken: string;

  @Column({ name: "origin_amount" })
  originAmount: number;

  @Column({ name: "destination_chain_id" })
  destinationChainId: number;

  @Column({ name: "destination_token" })
  destinationToken: string;

  @Column({ name: "destination_amount" })
  destinationAmount: number;
}
