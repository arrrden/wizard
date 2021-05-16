# The Wizard Registration Wizard 🪄
The purpose of this was to create a reusable Wizard component to guide a user through a given process. 

## TL;DR setup 
``` yarn install ```<br />
``` yarn dev```

this will run json-server on `3001` watching `db.json` and then start create-react-app (CRA) on `3000`.

## Requirements 
Requirements were thought of in two parts: those of the reusable Wizard, and those of a given exemplar process. 

### Features
- The wizard component wraps antd's Form component and will render any number of step components as part of a form within its body.
- Each wizard step may declaratively describe async `onExit` and `onSubmit` handlers (it could easily be extended to handle `onEntry` events too)
- Users may navigate between steps using the *Next* and *Previous* buttons, jump to sections using the *Edit* buttons from the summary section
- The user's name is validated for uniqueness against the backend when exiting the page 
- The user's name is set to a max length of 63 characters 
- The user's name is returned to greet them in stage 2
- The list of features is fetched from the backend for the user to select from
- The user's collected data is displayed in a summary with options to *edit* fields
- Submitting the form adds a new user to the backend asynchronously

