import { useState, useEffect, useCallback } from "react";
import { useWizardContext, WizardNavReducerActionType } from "./WizardProvider";

export interface Navigation {
  readonly next: () => void;
  readonly previous: () => void;
  readonly jumpTo: (stepIdentifier: string | number) => void;
  readonly submit?: <T>(arg: T) => T;
}

export type WizardStep = {
  identifier: string;
  heading?: string;
  body: (props: any) => JSX.Element;
  stepType?: "initial" | "final" | "submission";
  onExit?: (arg?: any) => Promise<"ok" | undefined> | ((arg?: any) => "ok" | undefined);
  onEnter?: (arg?: any) => Promise<"ok" | undefined> | ((arg?: any) => "ok" | undefined);
  // NOTE: really just sugar to make it explicit that this shouldn't just be an exit event
  onSubmit?: (arg?: any) => Promise<"ok" | undefined> | ((arg?: any) => "ok" | undefined);
};

export const useWizard = (
  steps: WizardStep[]
): {
  navigation: Navigation;
  step: WizardStep;
  nextStep: WizardStep | null;
  progress: number;
  isSubmitting: boolean;
} => {
  const [wizardStep, setWizardStep] = useState<WizardStep>(() => steps[0]);
  const [stepIndex, setStepIndex] = useState<number>(() =>
    steps.findIndex((step) => step.identifier === wizardStep.identifier)
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(() => false);

  const nextWizardStep = stepIndex + 1 < steps.length ? steps[stepIndex + 1] : null;

  // NOTE: this could be swapped for a reducer
  const handleUpdateWizardStep = useCallback(
    (stepIndex) => {
      setWizardStep(steps[stepIndex]);
    },
    [steps]
  );

  useEffect(() => {
    handleUpdateWizardStep(stepIndex);
  }, [stepIndex, handleUpdateWizardStep]);

  const progress = Math.floor((stepIndex / (steps.length - 1)) * 100);

  const navigation: Navigation = {
    next: () => {
      if (stepIndex + 1 < steps.length) {
        setStepIndex(stepIndex + 1);
      }
    },
    previous: () => {
      if (stepIndex - 1 >= 0) {
        setStepIndex(stepIndex - 1);
      }
    },
    jumpTo: (stepIdentifier) => {
      if (typeof stepIdentifier === "number") {
        if (stepIdentifier >= 0 && stepIdentifier < steps.length) {
          setStepIndex(stepIdentifier);
        }
      }
      if (typeof stepIdentifier === "string") {
        const newStep = steps.findIndex((step) => step.identifier === stepIdentifier);
        setStepIndex(newStep);
      }
    },
  };

  // NOTE: this could be handled better: we have to register navigation with the context if we
  // want to call it from within the step components.
  const { wizardNavigation: nav } = useWizardContext();

  useEffect(() => {
    const [_, dispatch] = nav;
    dispatch({
      type: WizardNavReducerActionType.INIT,
      payload: navigation,
    });
  }, []);

  return {
    step: wizardStep,
    nextStep: nextWizardStep,
    progress,
    isSubmitting,
    navigation,
  };
};
