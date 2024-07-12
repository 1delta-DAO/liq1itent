import { Length } from "class-validator";

export enum SortVariant {
  ASC = "ASC",
  DESC = "DESC",
}

export class SortingInput {
  @Length(1, 255)
  field: string;

  sortVariant: SortVariant;
}
