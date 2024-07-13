import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { OrderStatus } from "./order-status.enum";

export class OrderUpdateStatusInput {
  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: OrderStatus.FILLED,
    required: true,
  })
  status: OrderStatus;
}
