import { WizardStep } from "./hooks/useWizard";
import { useWizardContext, WizardReducerActionType } from "./hooks/WizardProvider";

import { NameDescriptionStep } from "./components/NameDescriptionStep";
import { Wizard } from "./components/Wizard";
import { FeaturesStep } from "./components/FeaturesStep";
import { SummaryStep } from "./components/SummaryStep";
import { CompleteStep } from "./components/CompleteStep";

const App = () => {
  const {
    wizardState: [state, dispatch],
  } = useWizardContext();

  const ifUniqueSetNameAndDescription = async (input: Response, formValues: { name: string; description: string }) => {
    const data = await input.json();
    if (Array.isArray(data) && data.length < 1) {
      dispatch({
        type: WizardReducerActionType.UPDATE,
        payload: {
          ...state,
          ...formValues,
        },
      });
    } else {
      throw new Error("Your name should be unique");
    }
  };

  const setFeatures = (formValues: number[]): "ok" => {
    dispatch({
      type: WizardReducerActionType.UPDATE,
      payload: {
        ...state,
        ...formValues,
      },
    });

    return "ok";
  };

  const steps: WizardStep[] = [
    {
      heading: "Welcome to WIZRD™",
      identifier: "initial",
      body: () => <NameDescriptionStep />,
      onExit: async (formValues): Promise<"ok" | undefined> => {
        let res: Response;
        try {
          res = await fetch(`http://127.0.0.1:3001/users?name=${formValues.name}`, {
            method: "GET",
          });
        } catch (e) {
          throw new Error(`Error validating new wizard: ${e}`);
        }
        if (res.ok) {
          await ifUniqueSetNameAndDescription(res, formValues);
        }
        return "ok";
      },
    },
    {
      heading: "Magical features",
      identifier: "features",
      body: () => <FeaturesStep />,
      onExit: async (formValues) => setFeatures(formValues),
    },
    {
      heading: "All set for sorcery?",
      identifier: "final",
      stepType: "submission",
      body: () => <SummaryStep />,
      onSubmit: async (state): Promise<"ok" | undefined> => {
        let res: Response;
        try {
          await fetch(`http://127.0.0.1:3401/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: state,
          });
        } catch (e) {
          throw new Error(`Error registering your profile`);
        }
        return "ok";
      },
    },
    {
      heading: "All set for sorcery?",
      identifier: "final",
      stepType: "final",
      body: () => <CompleteStep />,
    },
  ];

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Wizard steps={steps} />
    </div>
  );
};

export default App;
