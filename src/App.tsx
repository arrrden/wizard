import * as handle from "./utils/handleFetch";

import { WizardEventArgs, WizardStep } from "./hooks/useWizard";

import { NameDescriptionStep } from "./components/NameDescriptionStep";
import { Wizard } from "./components/Wizard";
import { FeaturesStep } from "./components/FeaturesStep";
import { SummaryStep } from "./components/SummaryStep";
import { CompleteStep } from "./components/CompleteStep";

import { User } from "./types/wizardWizardTypes";

export type GETResponseBody = User[];
export type POSTRequestBody = User;
export type POSTResponseBody = POSTRequestBody & {
  id: number;
};

const App = () => {
  const steps: WizardStep[] = [
    {
      heading: "Welcome to WIZRD™",
      identifier: "initial",
      body: (props: Omit<WizardEventArgs, "fn" | "formValues">) => <NameDescriptionStep {...props} />,
      onExit: async ({ formValues, state, fn: { updateState } }) => {
        const res = await handle.GET<GETResponseBody[]>(`http://127.0.0.1:3001/users?name=${formValues.name}`);
        if (res.length < 1) {
          updateState({ ...formValues });
          return "ok" as "ok"; // ...ok
        } else {
          throw new Error(`"${formValues.name}" is taken. Your name should be unique!`);
        }
      },
    },
    {
      heading: "Magical features",
      identifier: "features",
      body: (props: Omit<WizardEventArgs, "fn" | "formValues">) => <FeaturesStep {...props} />,
      onExit: ({ formValues, fn: { updateState } }) => {
        updateState(formValues);
        return "ok";
      },
    },
    {
      heading: "All set for sorcery?",
      identifier: "final",
      stepType: "submission",
      body: (props: Omit<WizardEventArgs, "fn" | "formValues">) => <SummaryStep {...props} />,
      onSubmit: async ({ state }): Promise<"ok" | undefined> => {
        const res = await handle.POST<POSTRequestBody, POSTResponseBody>(
          `http://127.0.0.1:3001/users`,
          state as POSTRequestBody,
          {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );
        if (res) {
          return "ok";
        }
      },
    },
    {
      heading: "You're ready to WIZRD™",
      identifier: "final",
      stepType: "final",
      body: (props: any) => <CompleteStep {...props} />,
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
      <Wizard steps={steps} displayNextStep />
    </div>
  );
};

export default App;
