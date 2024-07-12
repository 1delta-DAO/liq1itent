import { Length, IsNumber } from "class-validator";

export class TypeInput {
  @Length(1, 64)
  name: string;

  @Length(1, 256)
  description: string;

  @IsNumber()
  relevance: number;

  @Length(1, 1024)
  iconUrl: string;
}
