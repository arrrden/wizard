import { fireEvent, render, screen } from "@testing-library/react";
import { WizardContextProvider } from "../hooks/WizardProvider";

import { Wizard } from "./Wizard";

Object.defineProperty(window, "matchMedia", {
  value: () => {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
    };
  },
});

const TestWizard = () => (
  <WizardContextProvider>
  <Wizard
    steps={[
      {
        heading: "Welcome",
        identifier: "initial",
        body: () => <>Boo</>,
      },
      {
        heading: "Step 2",
        identifier: "second",
        stepType: "submission",
        body: () => <>Boo</>,
        onSubmit: async () => {
          let res; 
          setTimeout(() => res = "ok", 1000)
          return await res 
        }
      },
      {
        heading: "Step 3",
        identifier: "third",
        stepType: "final",
        body: () => <>Boo</>,
      },
    ]}
  />
</WizardContextProvider>
)


test("it renders Wizard component", () => {
  render(<TestWizard />)
  const wizard = screen.getByText(/Boo/i);
  expect(wizard).toBeInTheDocument();
});

test("it renders Wizard component", () => {
  render(<TestWizard />)
  const next = screen.getByText(/Next/i);
  expect(next).toBeInTheDocument();
});

