import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

import * as handle from "../utils/handleFetch";

import { Feature } from "../types/wizardWizardTypes";

export type WizardFeaturesContext = { featureList: Feature[] };
type GETResponseBody = Feature[];

// eslint-disable-next-line @typescript-eslint/no-redeclare
const WizardFeaturesContext = createContext<WizardFeaturesContext | undefined>(undefined);

export const useWizardFeaturesContext = () => {
  const ctx = useContext(WizardFeaturesContext);

  if (typeof WizardFeaturesContext === "undefined") {
    throw new Error(`Wizard feature context can only be got inside of a WizardFeaturesProvider`);
  }

  return ctx;
};

export const WizardFeaturesProvider = (props: { children: React.ReactNode }) => {
  const [featureList, setFeatureList] = useState<Feature[]>(() => []);

  const getFeatures = async () => {
    const res = await handle.GET<GETResponseBody>(`http://127.0.0.1:3001/features`);

    setFeatureList(res);
  };

  useEffect(() => {
    getFeatures();
  }, []);

  return <WizardFeaturesContext.Provider value={{ featureList }}>{props.children}</WizardFeaturesContext.Provider>;
};
