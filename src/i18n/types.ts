/** Maps a const dictionary shape to the same keys with `string` leaf values. */
export type DeepString<T> = T extends readonly (infer U)[]
  ? readonly DeepString<U>[]
  : T extends object
    ? { [K in keyof T]: DeepString<T[K]> }
    : string;
