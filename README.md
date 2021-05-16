# The Appvia Wizard Registration Wizard 🪄
The purpose of the task is to create a reusable Wizard component to guide a user through a given process. 

> *This was understood to mean a truly reusable component that could be demo-ed given the exemplar process.*

## TL;DR setup 
``` yarn install ```<br />
``` yarn run dev```

this will run json-server on `3001` watching `db.json` and then start create-react-app (CRA) on `3000`.

> *N.B. CRA was chosen because a webpack/whatever set up wasn't required and CRA is generally pretty ok*
## Requirements 
Requirements were thought of in two parts: those of the reusable Wizard, and those of the exemplar process. 
### For the Wizard
- Support for a **'Next' button** to move forward to the next step of the wizard.
- Support for an **async handler on each step** - for example, values from step 1
might be processed asynchronously and used in step 2.
- Support for building a **composite state** across the steps, to be submitted at the end of the wizard.

### For the exemplar process
- Step 1: Collect a **name (up to 63 characters)** and **description (multiline)**, the async handler for this step should post the name for validation to a back end.
- Step 2: **Given a fixed list** of possible 'features' that can be selected, each having a name and description, allow the user to **select one or more 'features'** to enable.
- Step 3: **Show a summary** of the name, description, and the names of features that have been enabled. Finishing the wizard should **submit the values to an asynchronous back end**.

### Features
- The wizard component wraps antd's Form component and will render any number of step components as part of a form within it's body.
- Each wizard step may describe async `onEntry`, `onExit`, `onSubmit` handlers. 
- Users may navigate between steps using the *Next* and *Previous* buttons, jump to sections using the *Edit* buttons provided by the `WizardProvider`
- The user's name is validated for uniqueness against the backend 
- The user's name is returned to greet them in stage 2
- The list of features is fetched from the backend 
- The user's data is displayed in a summary with options to *edit* fields or *reset* the form entirely
- Submitting the form adds a new user to the backend 

