'use strict';

/*
 * Main `oscaro-angular-wizard` module definition.
 *
 * Some directives inside the module take HTML markup either using `template` property,
 * or via external URL specified via `templateUrl` property. Keeping templates separate
 * from the rest of the code means every template is a separate request.
 * While it ease the development of the module, it can slow page load in production.
 * That's why we use `html2js` during the buid phase.
 *
 * The `templates-angularwizard` module is generated via `html2js` and is required in the
 * build version (`dist`) of the script (ready to be deployed in a target environment).
 *
 * See:
 *     - `grunt html2js` and `grunt concat`
 *     - https://github.com/karlgoldstein/grunt-html2js
 *     - http://bahmutov.calepin.co/angular-templates.html
 *
 * The following try...catch statement allow us to use the `oscaro-angular-wizard` in both
 * `src` and `dist`.
 */

try {
    angular.module('templates-angularwizard');
    angular.module('oscaro-angular-wizard', ['templates-angularwizard']);
} catch(err) {
    angular.module('oscaro-angular-wizard', []);  // Failed to require `templates-angularwizard`.
}
