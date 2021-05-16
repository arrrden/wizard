import { fireEvent, render, screen } from "@testing-library/react";

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
  <Wizard
    steps={[
      {
        heading: "Welcome",
        identifier: "initial",
        body: () => <>Beep</>,
      },
      {
        heading: "Step 2",
        identifier: "second",
        stepType: "submission",
        body: () => <>Boop</>,
        onSubmit: async () => {
          let res;
          setTimeout(() => (res = "ok"), 1000);
          return await res;
        },
      },
      {
        heading: "Step 3",
        identifier: "third",
        stepType: "final",
        body: () => <>Done</>,
      },
    ]}
  />
);

test("it renders Wizard component", () => {
  render(<TestWizard />);
  const wizard = screen.getByText(/Beep/i);
  expect(wizard).toBeInTheDocument();
});

