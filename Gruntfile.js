'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        config: {
            distDir: 'dist',
            srcDir: 'src',
            testDir: 'test'
        },

        // Validate files with JSHint.
        // https://github.com/gruntjs/grunt-contrib-jshint
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'src/**/*.js',
                'test/*.js',
                'Gruntfile.js'
            ]
        },

        // Compile Sass to CSS.
        // https://github.com/gruntjs/grunt-contrib-sass
        sass: {
            dist: {
                files: {
                    '<%= config.srcDir %>/css/<%= pkg.name %>.css': '<%= config.srcDir %>/scss/<%= pkg.name %>.scss'
                }
            }
        },

        // Run predefined tasks whenever watched file patterns are added, changed or deleted.
        // https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            css: {
                files: '<%= config.srcDir %>/scss/*.scss',
                tasks: ['sass']
            }
        },

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', [
        'watch'
    ]);

};
