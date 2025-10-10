import type { StateCreator, StoreApi } from "zustand";

declare module "zustand/vanilla" {
  export * from "zustand";
  export function createStore<TState>(initializer: StateCreator<TState, [], []>): StoreApi<TState>;
}

declare module "zustand/middleware/immer" {
  import type { StateCreator } from "zustand";

  export function immer<TState extends object>(
    initializer: StateCreator<TState, [["zustand/immer", never], [], []]>
  ): StateCreator<TState, [["zustand/immer", never], [], []]>;

  export default immer;
}
