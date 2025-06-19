declare module "zustand" {
  // Temporary ambient type until zustand is installed in node_modules during CI.
  export function create<TState>(
    initializer: (set: any, get: any) => TState
  ): (<U = TState>(selector?: (state: TState) => U) => U) & {
    getState: () => TState;
    setState: (partial: Partial<TState> | ((state: TState) => Partial<TState>), replace?: boolean) => void;
  };
}

declare module "zustand/middleware" {
  export function persist<S>(
    config: any,
    options: { name: string }
  ): any;
} 