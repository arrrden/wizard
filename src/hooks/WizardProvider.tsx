import * as React from "react";

import { createContext, Dispatch, useContext, useReducer } from "react";

export type WizardContextType = [state: { [x: string]: unknown }, dispatch: Dispatch<WizardReducerAction>];

export type WizardReducerAction = {
  type: WizardReducerActionType;
  payload: { [x: string]: unknown };
};

export enum WizardReducerActionType {
  RESET,
  UPDATE,
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const WizardReducer = <T extends unknown>(state: Record<string, T>, action: WizardReducerAction) => {
  const { payload } = action;

  switch (action.type) {
    case WizardReducerActionType.RESET:
      return {};
    case WizardReducerActionType.UPDATE:
      console.log("called with: ", { action });
      return {
        ...payload,
      };
    default:
      throw new Error(`Unhandled action '${action.type}'`);
  }
};

export const useWizardContext = () => {
  const ctx = useContext(WizardContext);

  if (!ctx) throw new Error("Cannot get WizardContext outside of a 'WizardContextProvider'");

  return ctx;
};

export const WizardContextProvider = (props: { children: React.ReactNode }) => {
  return (
    <WizardContext.Provider value={useReducer(WizardReducer, {}, () => ({}))}>{props.children}</WizardContext.Provider>
  );
};
