import { useState, useEffect, useCallback } from "react";

interface Navigation {
  readonly next: () => void;
  readonly previous: () => void;
  readonly jumpTo: (stepIdentifier: string | number) => void;
  readonly submit?: <T>(arg: T) => T;
}

export type WizardStep = {
  identifier: string;
  heading?: string;
  body: (props: any) => JSX.Element;
  stepType?: "initial" | "final";
  onExit?: (arg?: any) => Promise<"ok" | undefined>;
  onEnter?: (arg?: any) => Promise<"ok" | undefined>;
};

export const useWizard = (
  steps: WizardStep[],
  action?: "create" | "review" | "update",
  submit?: <T>(arg: T) => T
): {
  navigation: Navigation;
  step: WizardStep;
  nextStep: WizardStep | null;
  progress: number;
} => {
  const [wizardStep, setWizardStep] = useState<WizardStep>(() => steps[0]);
  const [stepIndex, setStepIndex] = useState<number>(() =>
    steps.findIndex((step) => step.identifier === wizardStep.identifier)
  );

  const nextWizardStep = stepIndex + 1 < steps.length ? steps[stepIndex + 1] : null;

  // TODO: swap this for a reducer
  const handleUpdateWizardStep = useCallback(
    (stepIndex) => {
      setWizardStep(steps[stepIndex]);
    },
    [steps]
  );

  useEffect(() => {
    handleUpdateWizardStep(stepIndex);
  }, [stepIndex, handleUpdateWizardStep]);

  const progress = Math.floor((stepIndex / steps.length) * 100);

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
    submit,
  };

  return {
    step: wizardStep,
    nextStep: nextWizardStep,
    progress,
    navigation,
  };
};
