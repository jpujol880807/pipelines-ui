# Getting Started with Create React App

## Description
User interface for the project https://github.com/jpujol880807/pipelines.
This is the usual project made in create-react-app.
I used typescript and ant design as library component.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Install
First install yarn
```shell script
npm i -g yarn
```
Then create a file .env.development.local and set the port for running the react project like in the example.
Also you must set in the `REACT_APP_API_URL` the address where the backend application is running.
```dotenv
PORT=3001
REACT_APP_API_URL='http://localhost:3000'
``` 
Notice that the port where react is running should be different from the port of backend pipelines application
Then run 
```shell script
yarn start
```
And the development server should be running. You can see it by visiting http://localhost:3000 if your environment matches the example.
## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
