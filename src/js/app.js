'use strict';

try {
    angular.module('templates-angularwizard');
    angular.module('oscaro-angular-wizard', ['templates-angularwizard']);
} catch(err) {
    // Failed to require `templates-angularwizard` which is generated via `html2js` during the buid phase.
    angular.module('oscaro-angular-wizard', []);
}
