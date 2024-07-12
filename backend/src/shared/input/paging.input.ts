import { IsNumber } from "class-validator";

export class PagingInput {
  @IsNumber()
  start: number;

  @IsNumber()
  limit: number;
}
