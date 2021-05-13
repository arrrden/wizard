import { NameDescriptionStep } from "./components/NameDescriptionStep";
import { Wizard } from "./components/Wizard";
import { WizardStep } from "./hooks/useWizard";

const steps: WizardStep[] = [
  {
    heading: "Welcome", 
    identifier: "initial",
    body: () => <NameDescriptionStep />,
  },
  {
    heading: "Next Step",
    identifier: "next",
    body: () => <>zap</>,
  },
  {
    heading: "Final Step but real real long",
    identifier: "final",
    body: () => <>ahhhh</>,
  },
];

const App = () => {
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
