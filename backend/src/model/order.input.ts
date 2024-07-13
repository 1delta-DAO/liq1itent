import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";
import { WalletType } from "./wallet-type.enum";
import { OrderStatus } from "./order-status.enum";

export class OrderInput {
  @Length(32, 44)
  @ApiProperty({
    type: String,
    example: "0xE0582D2AbadAaa310EC35F56c56259c15C464F17",
    required: true,
  })
  settlementContract: string;

  @Length(32, 44)
  @ApiProperty({
    type: String,
    example: "0xE0582D2AbadAaa310EC35F56c56259c15C464F17",
    required: true,
  })
  swapperWallet: string;

  @ApiProperty({
    type: String,
    example: WalletType.EVM,
    required: true,
  })
  swapperWalletType: WalletType;

  @ApiProperty({
    type: String,
    example: OrderStatus.NEW,
    required: true,
  })
  status: OrderStatus;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  nonce: number;

  @ApiProperty({
    type: String,
    example: "0x0",
    required: true,
  })
  signature: string;

  @ApiProperty({
    type: Date,
    example: new Date(),
    required: true,
  })
  created: Date;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  initiateDeadlineBlock: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  fillDeadlineBlock: number;

  @ApiProperty({
    type: Number,
    example: 137,
    required: true,
  })
  originChainId: number;

  @Length(32, 44)
  @ApiProperty({
    type: String,
    example: "0xE0582D2AbadAaa310EC35F56c56259c15C464F17",
    required: true,
  })
  originToken: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  originAmount: number;

  @ApiProperty({
    type: Number,
    example: 5000,
    required: true,
  })
  destinationChainId: number;

  @Length(32, 44)
  @ApiProperty({
    type: String,
    example: "0xE0582D2AbadAaa310EC35F56c56259c15C464F17",
    required: true,
  })
  destinationToken: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  destinationAmount: number;
}
