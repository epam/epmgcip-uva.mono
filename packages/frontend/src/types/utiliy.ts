export type NonEmptyArray<T> = [T, ...T[]];

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];
