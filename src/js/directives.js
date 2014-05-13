'use strict';

// Creating Custom Directives
// https://docs.angularjs.org/guide/directive

// Comprehensive Directive API
// https://docs.angularjs.org/api/ng/service/$compile#comprehensive-directive-api

// Understanding Directives
// https://github.com/angular/angular.js/wiki/Understanding-Directives

angular

    .module('mgo-angular-wizard')

    /**
     * The wizard component is built from a combination of 2 directives
     * that communicate (`wizard` and `wizardStep`).
     *
     * @example
        <wizard>
            <wizard-step>
                Step 1
            </wizard-step>
            <wizard-step>
                Step 2
            </wizard-step>
        </wizard>
     */

    /**
     * @name wizard
     * @restrict EA
     *
     * @description
     * The main `wizard` directive.
     * Act as a container for multiple steps and handle the state and navigation between steps.
     * CSS classes are used in the markup and are based on the state of the wizard, e.g.:
     * {
     *     default: !step.completed && !step.selected,
     *     current: step.selected && !step.completed,
     *     done: step.completed && !step.selected,
     *     editing: step.selected && step.completed
     * }
     *
     * @param {function} `on-finish` (optional)
     * A function to be called when the wizard is finished.
     *
     * @param {string} `name` (optional)
     * The name of the wizard. Defaults to "Default wizard". Used for the `WizardHandler`.
     *
     * @param {boolean} `hide-indicators` (optional)
     * Show or hide the steps indicators summary at the bottom of the page. Defaults to false.
     *
     * @param {template} `template` (optional)
     * Path to a custom template.
     *
     * @example
        <wizard on-finish="finished()" hide-indicators="true">
     */
    .directive('wizard', function () {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                onFinish: '&',
                hideIndicators: '=',
                name: '@'
            },
            templateUrl: function (element, attributes) {
                return attributes.template || 'js/wizard.tpl.html';
            },
            // A `controller` function can expose an API and `link` function can interact with a controller via require.
            controller: ['$scope', '$element', 'WizardHandler', function ($scope, $element, WizardHandler) {

                // Use the WizardHandler factory to create a wizard.
                WizardHandler.addWizard($scope.name || WizardHandler.defaultName, this);

                // Run a clean-up function when the directive is removed.
                $scope.$on('$destroy', function () {
                    WizardHandler.removeWizard($scope.name || WizardHandler.defaultName);
                });

                $scope.steps = [];

                $scope.goTo = function (step) {
                    unselectAll();
                    $scope.selectedStep = step;  // Pass the current step to the $scope.
                    step.selected = true;  // Mark the current step as `selected`.
                };

                function unselectAll() {
                    angular.forEach($scope.steps, function (step) {
                        step.selected = false;
                    });
                    $scope.selectedStep = null;
                }

                this.getStepsLength = function () {
                    return $scope.steps.length;
                };

                // Collect all steps in the $scope.steps array.
                this.addStep = function (stepScope) {
                    $scope.steps.push(stepScope);
                    if ($scope.steps.length === 1) {
                        // Always automatically display the first step while collecting steps.
                        $scope.goTo($scope.steps[0]);
                    }
                };

                // Go to the next step.
                this.next = function () {
                    var index = $scope.selectedStep.index;
                    $scope.selectedStep.completed = true;  // Mark the selected step as `completed`.
                    if (index === $scope.steps.length - 1) {
                        this.finish();
                    } else {
                        $scope.goTo($scope.steps[index + 1]);
                    }
                };

                // Go to an arbitrary step number.
                this.goTo = function (stepNumber) {
                    $scope.goTo($scope.steps[stepNumber]);
                };

                // Mark the `selectedStep` as `completed`.
                this.completeSelectedStep = function() {
                    $scope.selectedStep.completed = true;
                };

                this.finish = function () {
                    if ($scope.onFinish) {
                        $scope.onFinish();
                    }
                };

                this.cancel = this.previous = function () {
                    var index = $scope.selectedStep.index;
                    if (index === 0) {
                        throw new Error("Can't go back. It's already in step 0");
                    } else {
                        $scope.goTo($scope.steps[index - 1]);
                    }
                };

            }]

        };
    })

    /**
     * @name wizardStep
     * @restrict EA
     *
     * @description
     * The `wizardStep` directive.
     *
     * @param {string} `stepTitle` (optional)
     * The title of the current step which will be displayed in the steps indicators summary at
     * the bottom of the page.
     *
     * @example
        <wizard-step step-title="Step 1">
            <h1>Step 1</h1>
        </wizard-step>
        <wizard-step step-title="Step 2">
            <h1>Step 2</h1>
        </wizard-step>
     */
    .directive('wizardStep', function () {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                stepTitle: '@'  // '@' sets up one-way "string" databinding (parent scope → directive isolate scope).
            },
            require: '^wizard',  // Search for the parent `wizard` controller.
            templateUrl: function (element, attributes) {
                return attributes.template || 'js/step.tpl.html';
            },
            // When a directive requires a controller ('^wizard'), it receives that controller
            // as the fourth argument of its link function.
            link: function ($scope, $element, $attrs, wizard) {

                // Keep a reference to the index of the current step.
                $scope.index = wizard.getStepsLength();

                // If no `stepTitle` attribute is provided, fallback to the current step number (1-indexed).
                $scope.title = $scope.stepTitle || $scope.index + 1;

                // Add the step to the wizard steps array.
                wizard.addStep($scope);

            }
        };
    });
