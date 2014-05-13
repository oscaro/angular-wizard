# Angular-Wizard

**Forked from [mgonto/angular-wizard](https://github.com/mgonto/angular-wizard)**

Angular-wizard is a component that will make it easy for you to create wizards in your app.


# Installation

Downloading it manually by getting the files from the dist folder.


# Dependencies

Angular-wizard depends on [AngularJS](https://angularjs.org) `1.2.16`.


# User Guide

## First example

The first thing we need to do is add a dependency to angular-wizard module which is called `mgo-angular-wizard`.

We can do this by doing:

````js
angular.module('your-app', ['mgo-angular-wizard']);
````

Now, in some HTML for a controller, you can just add a wizard as follows:

````html
<wizard> 
    <wizard-step step-title="Step 1">
        <h1>Step 1</h1>
        <p>Here you can use whatever you want. You can use other directives, binding, etc.</p>
        <input type="submit" wizard-next value="Continue">
    </wizard-step>
    <wizard-step step-title="Step 2">
        <h1>Step 2</h1>
        <p>You have continued here!</p>
        <input type="submit" wizard-next value="Go on">
    </wizard-step>
    <wizard-step step-title="Step 3">
        <h1>Step 3</h1>
        <input type="submit" wizard-next value="Finish now">
    </wizard-step>
</wizard>
````

Let's go step by step to see how this works.

1) You need to declare a master `wizard` directive. This `wizard` directive, has the following options as attributes:

- **on-finish**: a function to be called when the wizard is finished.
- **name**: the name of the wizard. By default, it's called "Default wizard". It's used for the `WizardHandler` which we'll explain later.
- **hide-indicators**: if set to true, the indicators in the bottom of the page showing the current page and allowing navigation for the wizard will be hidden. Defaults to false.
- **template**: path to a custom template.

2) Inside the wizard, we can have as many steps as we want. Each step can have an optional title. Inside each step, we can put whatever we want. Other directives, bindings, controls, forms, etc.

3) Inside the step, we now see a button which has a `wizard-next` attribute. That means that clicking that button will send the user to the next step of wizard. Similar to `wizard-next`, we have the following attributes:

- **wizard-previous**: goes to the previous step
- **wizard-cancel**: goes back to the first step
- **wizard-finish**: finishes the wizard and calls the on-finish later on. It's important to note that if we're in the last step and we put `wizard-next` it'll be the same as putting `wizard-finish` as the wizard will know we're at the last screen.

All of this attributes can receive an optional function to be called before changing the step. Something like:

````html
<input type="button" wizard-next="setMode(mode)" value="Next">
````

In this case, the `setMode` function will be called before going to the next step.

## Manipulating the wizard from a service

There're some times where we actually want to manipulate the wizard from the controller instead of from the HTML.

For those cases, we can inject the `WizardHandler` service to our controller.

The main function of this service is the `wizard(name)` which will let you get the wizard to manipulate it. If you have just one wizard in the screen and you didn't set a name to it, you can just call it as `wizard()`. Let's see an example:

````html
<wizard-step step-title="Cool step">
    <input type="submit" ng-click="changeLabelAndGoNext()">
</wizard-step>
````

````js
// In your controller
$scope.changeLabelAndGoNext = function() {
    $scope.model.label = "Hola Gonto";
    WizardHandler.wizard().next();
}
````

In this case, we're changing a label and moving forward on the steps.
The functions available in the `wizard()` are:
- **next**: goes to the next step
- **previous**: goes to the previous step
- **finish**: finishes the wizard.
- **goTo(number)**: this goes to the indicated step number.

## Navigation bar

The navigation bar shown below works in the following way:

- Completed steps are painted as green
- Current step is painted as dark grey
- Future step is painted as light grey
- Editing step (Modifying a step already completed in the past) is painted as red
- You can click in any completed step to go back to that step. You can't click in the current step nor in the future ones unless you've already completed a future step before (for example in EditMode all steps are completed by default)

All of those colors are variables in the `angular-wizard.scss`. You can easily change them by changing the colors in that file.

# License

The MIT License

Copyright (c) 2013 Martin Gontovnikas http://www.gon.to/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
