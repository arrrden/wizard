import { useState, useEffect, useCallback } from "react";
export interface Navigation {
  readonly next: () => void;
  readonly previous: () => void;
  readonly jumpTo: (stepIdentifier: string | number) => void;
  readonly submit?: <T>(arg: T) => T;
}

export type State = Record<string, unknown>;

export type WizardEventArgs = {
  state: State;
  navigation: Navigation;
  formValues?: any;
  fn: { updateState: (arg: object) => void };
};

export type WizardStep = {
  identifier: string;
  heading?: string;
  body: (props: Omit<WizardEventArgs, "fn" | "formValues">) => JSX.Element;
  stepType?: "initial" | "final" | "submission";
  onEnter?: (arg: WizardEventArgs) => Promise<"ok" | undefined> | ("ok" | undefined); // NOTE: unused, but here for completeness
  onExit?: (arg: WizardEventArgs) => Promise<"ok" | undefined> | ("ok" | undefined);
  onSubmit?: (arg: Omit<WizardEventArgs, "fn">) => Promise<"ok" | undefined> | ("ok" | undefined);
};

export const useWizard = (
  steps: WizardStep[]
): {
  navigation: Navigation;
  step: WizardStep;
  stepIndex: number;
  nextStep: WizardStep | null;
  progress: number;
} => {
  const [wizardStep, setWizardStep] = useState<WizardStep>(() => steps[0]);
  const [stepIndex, setStepIndex] = useState<number>(() =>
    steps.findIndex((step) => step.identifier === wizardStep.identifier)
  );
  const nextWizardStep = stepIndex !== steps.length - 1 ? steps[stepIndex + 1] : null;

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

  return {
    step: wizardStep,
    stepIndex,
    nextStep: nextWizardStep,
    progress,
    navigation,
  };
};
