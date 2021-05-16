
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent, prettyDOM } from "@testing-library/react";

import App from "./App";
import { WizardContextProvider } from './hooks/WizardProvider';

Object.defineProperty(window, 'matchMedia', {
  value: () => {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {}
    };
  }
})

test('it renders without crashing', () => {
  render(<WizardContextProvider><App /></WizardContextProvider>);
});
