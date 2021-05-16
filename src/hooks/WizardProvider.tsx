import * as React from "react";

import { createContext, Dispatch, useContext, useReducer } from "react";
import { Navigation } from "./useWizard";

export type WizardContextType = {
  wizardNavigation: [Navigation, Dispatch<WizardReducerAction<WizardNavReducerActionType, Navigation>>];
  wizardState: [state: { [key: string]: unknown }, dispatch: Dispatch<WizardReducerAction<WizardReducerActionType>>];
};

export type WizardReducerAction<T, P = { [key: string]: unknown }> = {
  type: T;
  payload: P;
};

export enum WizardReducerActionType {
  UPDATE,
}

export enum WizardNavReducerActionType {
  INIT,
  USE,
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const WizardReducer = <T extends unknown>(
  state: Record<string, T>,
  action: WizardReducerAction<WizardReducerActionType>
) => {
  const { payload } = action;

  switch (action.type) {
    // NOTE: this only handles updating the entire state but could easily extend to handle
    // reset ({}), patching, or validating state at this level
    case WizardReducerActionType.UPDATE:
      console.log("called with: ", { action });
      return {
        ...payload,
      };
    default:
      throw new Error(`Unhandled action '${action.type}'`);
  }
};

const WizardNavReducer = (state: Navigation, action: WizardReducerAction<WizardNavReducerActionType, Navigation>) => {
  const { payload } = action;

  switch (action.type) {
    case WizardNavReducerActionType.INIT:
      return {
        ...payload,
      };
    case WizardNavReducerActionType.USE:
      return state;
  }
};

export const useWizardContext = () => {
  const ctx = useContext(WizardContext);

  if (!ctx) throw new Error("Cannot get WizardContext outside of a 'WizardContextProvider'");

  return ctx;
};

export const WizardContextProvider = (props: { children: React.ReactNode }) => {
  // NOTE: we define navigation in state so that we may register it with the provider from the useWizard hook
  // down the tree. This means we can control navigation from within for elements rather than just within the
  // Wizard component itself
  return (
    <WizardContext.Provider
      value={{
        wizardNavigation: useReducer(WizardNavReducer, {}, () => ({} as Navigation)), 
        wizardState: useReducer(WizardReducer, {}, () => ({})),
      }}
    >
      {props.children}
    </WizardContext.Provider>
  );
};
