export type Unpacked<T> = T extends (infer U)[] ? U : T;

export type PartialDeep<T> = {
  [P in keyof T]?: PartialDeep<T[P]>;
};
