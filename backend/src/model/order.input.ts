import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";
import { WalletType } from "./wallet-type.enum";
import { OrderStatus } from "./order-status.enum";

export class OrderInput {
  @Length(32, 44)
  @ApiProperty({
    type: String,
    example: "0x1F9C950BF6eF4c7032A60c8194eE60F858f1Ea9e",
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
    example: "0x",
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
    example: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
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
    example: "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8",
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
