# About

[![Build Status](https://travis-ci.org/42BV/jarb-redux-form.svg?branch=master)](https://travis-ci.org/42BV/jarb-redux-form)
[![Codecov](https://codecov.io/gh/42BV/jarb-redux-form/branch/master/graph/badge.svg)](https://codecov.io/gh/42BV/jarb-redux-form)

[JaRB](http://www.jarbframework.org/) JaRB aims to improve database 
usage in Java enterprise applications. With JaRB you can get the
validation rules from the database into Java. With this project
you can get those rules into your [redux-form](http://redux-form.com/) powered
forms as well.

# Installation

`npm install jarb-redux-form --save`

# Preparation

First in your Java project make sure jarb-redux-form can read
the contraints, via a GET request:

```Java
// EntityConstraintsController.java

@RestController
@RequestMapping("/constraints")
public class ConstraintsController {
    private final BeanConstraintService beanConstraintService;

    @Autowired
    ConstraintsController(BeanConstraintDescriptor beanConstraintDescriptor) {
        beanConstraintService = new BeanConstraintService(beanConstraintDescriptor);
        beanConstraintService.registerAllWithAnnotation(Application.class, Entity.class);
    }

    @RequestMapping(method = RequestMethod.GET)
    Map<String, Map<String, PropertyConstraintDescription>> describeAll() {
        return beanConstraintService.describeAll();
    }
}
```

# Getting started.

We assume you have a working Redux project, if you do not yet have
Redux add Redux to your project by following the Redux's instructions.

We also assume that you have redux-form installed via the instructions
provided on the website.

First install the following dependencies in the package.json:

  1. "react-redux": "^6.0.0",
  2. "redux": "3.6.0",
  3. "redux-form": "^8.1.0"

Now add the constraints-reducer to your rootReducer for example:

```js
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { constraints, ConstraintsStore } from 'jarb-redux-form';

export type Store = {
  constraints: ConstraintsStore
};

// Use ES6 object literal shorthand syntax to define the object shape
const rootReducer: Store = combineReducers({
  constraints,
  form: formReducer
});

export default rootReducer;
```

This should add the ConstraintsStore to Redux, which will store
the constraints from JaRB.

Next you have to configure the constraints module:

```js
import { createStore } from 'redux';
import { configureConstraint } from 'jarb-redux-form';

export const store = createStore(
  rootReducer,
);

configureConstraint({
   // The URL which will provide the constraints over a GET request.
  constraintsUrl: '/api/constraints',

  // Whether or not the 'constraintsUrl' should be called with authentication.
  needsAuthentication: true,

  // The dispatch function for the Redux store.
  dispatch: store.dispatch,

  // A function which returns the latests ConstraintsStore from Redux.
  constraintsStore: () => store.getState().constraints
});
```

The constraints module must be configured before the application
is rendered.

Finally you will have load the constraints from the back-end using
the `loadConstraints` function. If in order for the constraints
to be loaded you need to be logged in, you should load the constraints
as soon as you know that you are logged in:

```js
import { loadConstraints } from 'jarb-redux-form';
import { login } from 'somewhere';

class Login extends Component {
  doLogin(username, password) {
    login({ username, password })
      .then(loadConstraints); // Load constraints ASAP
  }

  render() {
    // Render here which calls doLogin
  }
}
```

If you do not need a login before you can fetch the constraints
simply fetch them using `loadContraints` as soon as possible.

# Usage

## Using JarbField

If you read the documentation of the redux-form libary you will know
that you will need the `Field` Component to render form elements. This
library simply extends `Field` by adding JaRB validation rules to it.

This abstraction is called `JarbField`. JarbField wrappes 
redux-form's Field, and adds the auto validation from the 
ConstraintsStore. In fact it is a very thin wrapper around
Field.

It only demands one extra property called 'jarb' which is used
to to configure the Field. The 'jarb' object needs two keys:
the 'validator' and the 'label'. 

The 'validator' follows the following format: {Entity}.{Property}. 
For example if the validator property is 'SuperHero.name' this means that
the Field will apply the constraints for the 'name' property of
the 'SuperHero' entity.
 
The 'label' is used to inform you which field was wrong, when errors occur.
You will receive the 'label' when an error occurs to create a nice
error message.

For example:

```js
<JarbField 
  name="Name" 
  jarb={{ validator: 'SuperHero.name', label: "Name" }} 
  component="input" 
  type="text"
/>
```

## Displaying erors

Rendering the validation errors is completely up to you.

The way it works is as follows, whenever an error occurs
the `error` prop of the Field's `meta` data will contain
an object with the following shape:

```js
{
  // The type of error which occured
  "type": "ERROR_MINIMUM_LENGTH",
  // The label of the JarbField
  "label": "Description",
  // The value that the field possesed at the time of the error
  "value": '',
  // The reason why the error occured.
  "reasons": { "minimumLength": 3 }
}
``` 

The following `ValidationType`'s exist:

```JavaScript
export type ValidationType = 'ERROR_REQUIRED'
                           | 'ERROR_MINIMUM_LENGTH'
                           | 'ERROR_MAXIMUM_LENGTH'
                           | 'ERROR_MIN_VALUE'
                           | 'ERROR_MAX_VALUE'
                           | 'ERROR_PATTERN';
```

Now you could create an Error Component to render the errors:

```js
import { ValidationError } from 'jarb-redux-form';
import React, { Component } from 'react';

interface Props {
  meta: {
    invalid: boolean,
    error: ValidationError,
    touched: boolean
  }
}

export default function Error(props: Props) {
  render() {
    const { invalid, error, touched } = props.meta;

    if (invalid && touched) {
      return <span className="error">{ errorMessage(error) }</span>;
    }

    return null;
  }
};

// Render a nice message based on each ValidationType.
function errorMessage(error: ValidationError): string {
  switch(error.type) {
    case 'ERROR_REQUIRED':
      return `${ error.label } is required`;
    case 'ERROR_MINIMUM_LENGTH':
      return `${ error.label } must be bigger than ${ error.reasons.minimumLength } characters`;
    case 'ERROR_MAXIMUM_LENGTH':
      return `${ error.label } must be smaller than ${ error.reasons.maximumLength } characters`;
    case 'ERROR_MIN_VALUE':
      return `${ error.label } must be more than ${ error.reasons.minValue }`;
    case 'ERROR_MAX_VALUE':
      return `${ error.label } must be less than ${ error.reasons.maxValue }`;
    case 'ERROR_PATTERN':
      return `${ error.label } does not match the pattern: ${error.reasons.regex`;
    default:
     return 'UNKNOWN_ERROR';
  }
}
```

Here are examples of all errors which can occur:

```js
{
  "type": "ERROR_REQUIRED",
  "label": "Name",
  "value": '',
  "reasons": { "required": "required" }
}

{
  "type": "ERROR_MINIMUM_LENGTH",
  "label": "Description",
  "value": '',
  "reasons": { "minimumLength": 3 }
}

{
  "type": "ERROR_MAXIMUM_LENGTH",
  "label": "Info",
  "value": 'aaaa',
  "reasons": { "maximumLength": 3 }
}

{
  "type": "ERROR_MIN_VALUE",
  "label": "Age",
  "value": 1,
  "reasons": { "minValue": 15 }
}

{
  "type": "ERROR_MAX_VALUE",
  "label": "Amount",
  "value": 16,
  "reasons": { "maxValue": 15 }
}

{
  "type": "ERROR_PATTERN",
  "label": "Telephone",
  "value": 'noot',
  "reasons": { "regex": /^-?\d+$/ }
}
```
