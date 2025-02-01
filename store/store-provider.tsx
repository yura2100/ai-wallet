"use client";

import {createStore, Provider} from "jotai";
import {ReactNode} from "react";

export const store = createStore();

export function StoreProvider({children}: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
