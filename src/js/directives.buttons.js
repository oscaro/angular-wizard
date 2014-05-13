'use strict';

function wizardButtonDirective(action) {

    angular

        .module('mgo-angular-wizard')

        .directive(action, function () {
            return {
                restrict: 'A',
                replace: false,
                require: '^wizard',
                link: function ($scope, $element, $attrs, wizard) {

                    $element.on('click', function (e) {
                        e.preventDefault();
                        $scope.$apply(function () {
                            $scope.$eval($attrs[action]);
                            wizard[action.replace('wizard', '').toLowerCase()]();
                        });
                    });
                }
            };
        });

}

wizardButtonDirective('wizardNext');
wizardButtonDirective('wizardPrevious');
wizardButtonDirective('wizardFinish');
wizardButtonDirective('wizardCancel');
