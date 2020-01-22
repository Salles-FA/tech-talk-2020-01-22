# GFT Tech Talk 2020-01-22

## Description

### ReactJS + [~~Redux-Form~~](https://jaredpalmer.com/formik/docs/overview#why-not-redux-form) Formik: From the ground up to the cloud

[_“React makes it painless to create interactive UIs.”_](https://reactjs.org/#declarative)

One thing that creates too much discussions about this statement is related to make FORMs in React.
There are many ways to implement that: Controlled Components, Uncontrolled Components…
Some advanced technics using Redux… actually the Fully-Fledged Solution the docs mention to use is the library ["formik"](https://jaredpalmer.com/formik).
Formik is described as a “complete solution including validation, keeping track of the visited fields, and handling form submission”.

In this GFT Tech Talk we’re going to start a React App using “create-react-app” and evaluate a FORM UI using formik library, since the beginning.
As a plus we will create a template and publish it to a Google Cloud Compute instance.

### Minibio

Fábio Andrey Salles holds a Bachelor of Computational Engineering degree and is [working as Full Stack Developer at GFT](https://www.linkedin.com/in/fábio-salles-32133b57).

## Prerequisites

This is an **intermediate level** lab. Medium, to advanced prior experience with React is assumed.
Familiarity with JavaScript ES6+ (
[arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), 
[let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), 
[const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const), 
[spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), 
[destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment),
etc...) and HTML5 is also required.
If you are looking for more introdutory material in this service area, be sure to check out the following links:

* [Tutorial: Intro to React](https://reactjs.org/tutorial/tutorial.html)
* [freeCodeCamp.org](https://www.freecodecamp.org/learn/)

Be sure you have the following software installed:
* [Visual Studio Code](https://code.visualstudio.com/)
    * [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [NodeJS >= v8.16.1](https://nodejs.org/)
* [Google Chrome](https://www.google.com/chrome/)
    * [React Developer Tools - Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
* [git](https://git-scm.com/downloads)

For a better experience with this lab [a repository on github has been prepared](https://github.com/Salles-FA/tech-talk-2020-01-22.git).
So you can follow step-by-step with your own code or checkout the final lab branch as well.

Clone the repository from github:

```sh
git clone https://github.com/Salles-FA/tech-talk-2020-01-22.git
```

Once you're ready, scroll down to get your lab environment set up.

## From the ground...

First things first.
Let's start a new react project using the powerful tool provided by facebook team: [create-react-app](https://github.com/facebook/create-react-app).

```sh
npx create-react-app example-app
```

By doing this, you sure you are using the awesome ["react-scripts"](https://stackoverflow.com/a/50722201) and all the related packages and features to enjoy the most of developing with React.

So let's step into our `example-app` folder and install formik and other tools.

```sh
cd example-app
npm install --save formik yup @material-ui/core
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

You can use formik with a simple HTML input like the official [formik tutorial](https://jaredpalmer.com/formik/docs/tutorial),
but in this example we're going to use a [React library for Material Design](https://material-ui.com/). So, in this way, this lab becomes a much more practical example for our day-to-day coding lives.

Also we are going to use [Yup](https://github.com/jquense/yup) to perform validations in our form.

Now we have to setup some [ESLint/Prettier](https://prettier.io/docs/en/integrating-with-linters.html) rules. 
This is not our focus in this lab, but it's recommended to follow some patterns when you code in teams.
Building high-quality apps is hard for many reasons: 
 - The more your codebase grows, the more it becomes hard to maintain
 - Developers have different way to code, which can confuse you and slow you down
 - You can fall into common pitfalls

You can configure this rules in distinct files (``.eslintrc`` and ``.prettierrc``) or via keys in the ``package.json`` file. For our example we are using just few rules so we are going to change our ``package.json``.
Please update your ``eslintConfig`` section in ``package.json`` to resemble the following:
```json
    {...}
    "eslintConfig": {
        "extends": [
            "react-app",
            "plugin:prettier/recommended",
            "prettier/react",
            "prettier/standard"
            ],
            "rules": {
                "prettier/prettier": [
                "error",
                {
                    "jsxSingleQuote": true,
                    "singleQuote": true,
                    "printWidth": 120
                }
            ],
            "react/prop-types": "error"
        }
    },
    {...}
```

## ... speeding up...
The best on abstraction is to build reusable input primitive that you can share around your application. 
Following the formik [Final Result](https://codesandbox.io/s/formik-v2-tutorial-final-bq0li), a good starting point of our lab is with this single ``material-ui input``.
```jsx
import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Input, Button, InputLabel, InputAdornment, FormHelperText, FormControl, Grid } from '@material-ui/core';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing(1)
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  textField: {
    width: 200
  }
}));

export default function FormikExample() {
  const classes = useStyles();

  //#region InputPercent
  const InputPercent = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    const componentId = props.id || props.name;
    const formHelperId = `${componentId}-helper-text`;
    return (
      <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
        <InputLabel htmlFor={componentId}>{label}</InputLabel>
        <Input
          {...field}
          {...props}
          error={meta.touched && meta.error}
          endAdornment={<InputAdornment position='end'>%</InputAdornment>}
          aria-describedby={formHelperId}
        />
        <FormHelperText error id={formHelperId}>
          {meta.touched && meta.error}
        </FormHelperText>
      </FormControl>
    );
  };
  //#endregion InputPercent

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{ fee: '' }}
        validationSchema={Yup.object({
          fee: Yup.number()
            .min(0)
            .max(100)
            .required()
        })}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        <Form>
          <Grid container xs={12}>
            <InputPercent label='Fee' name='fee'></InputPercent>
          </Grid>
          <Button type='submit' variant='contained' color='primary'>
            Submit
          </Button>
        </Form>
      </Formik>
    </div>
  );
}
```

Go for the challenge: [Our Final Result](http://34.68.194.139).

### Some guidance to complete

[Props validation](https://reactjs.org/docs/typechecking-with-proptypes.html)

```jsx
  InputPercent.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  };
``` 

Higher-Order Component
```jsx
  //#region AutoCalc
  const AutoCalc = () => {
    const { values, setFieldValue } = useFormikContext();
    React.useEffect(() => {
      setFieldValue('value', (values.received.amount * values.received.fee) / 100);
    }, [setFieldValue, values]);

    return null;
  };
  //#endregion AutoCalc
```

Additional material-ui component
```jsx
    <Typography gutterBottom variant='subtitle1'>
        Subtitle1
    </Typography>
```

Once you get the final result continue...

## ... ready to fly...
Now we are going to [Google Cloud](https://cloud.google.com/).
Prepare the docker image and deploy it in a Google Kubernetes Engine.

### Dockerfile
```dockerfile
FROM nginx:1.16.1-alpine
WORKDIR /usr/share/nginx/html
COPY ./build .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build commands
```sh
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
cd example-app
npm install --production
npm run build
export MY_PROJ="techtalk20200122"
gcloud config set project $MY_PROJ
docker build -t gcr.io/$MY_PROJ/example-ui:v1 .
docker push gcr.io/$MY_PROJ/example-ui:v1
```

### Test it before launch
```sh
docker run -d -p 8080:80 gcr.io/$MY_PROJ/example-ui:v1
```

## ... up to the cloud!

[Kubernetes in the Google Cloud](https://www.qwiklabs.com/quests/29)

### Build a Kubernetes Cluster
```sh
gcloud config set compute/zone us-central1-a
gcloud container clusters create example-cluster
```
### Deploy the application 
```sh
gcloud container clusters get-credentials example-cluster
kubectl create deployment example-front-server --image=gcr.io/$MY_PROJ/example-ui:v1
kubectl expose deployment example-front-server --type=LoadBalancer --port 80
```
### Get the external ip to view the application
```sh
kubectl get service
```

## Clean Up
Run the following to delete the cluster:

```sh
gcloud container clusters delete example-cluster
```

# Give me your feedback
[Fábio Andrey Salles - fabio.salles@gft.com](mailto:fabio.salles@gft.com)
