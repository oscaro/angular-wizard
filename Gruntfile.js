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

        // Delete the contents of the build directory before initiating a new build process.
        // https://github.com/gruntjs/grunt-contrib-clean
        clean: {
            build: [
                '<%= config.distDir %>'  // Delete all files and folders in the `dist` directory.
            ],
            postBuild: [
                '<%= config.distDir %>/js',  // Delete the `js` directory.
                '<%= config.distDir %>/css'  // Delete the `css` directory.
            ]
        },

        // Copy files and folders.
        // https://github.com/gruntjs/grunt-contrib-copy
        copy: {
            build: {
                cwd: '<%= config.srcDir %>',  // cwd points to a directory the source files are relative to.
                src: ['**', '!scss/**', '!index.html'],  // src specifies the source files.
                dest: '<%= config.distDir %>',
                expand: true
            },
        },

        // Converts AngularJS templates to JavaScript.
        // https://github.com/karlgoldstein/grunt-html2js
        html2js: {
            angularwizard: {
                options: {
                    base: '<%= config.distDir %>'
                },
                src: [ '<%= config.distDir %>/js/*.html' ],
                dest: '<%= config.distDir %>/js/<%= pkg.name %>.tpls.js'
            },
        },

        // Concatenate files.
        // https://github.com/gruntjs/grunt-contrib-concat
        concat: {
            js: {
                options: {
                    // Replace all 'use strict' statements in the code with a single one at the top.
                    banner: "'use strict';\n",
                    process: function(src, filepath) {
                        return '// Source: ' + filepath + '\n' +
                            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    },
                },
                src: [
                    '<%= config.distDir %>/js/*.js'
                ],
                dest: '<%= config.distDir %>/<%= pkg.name %>.js'
            },
            css: {
                options: {},
                src: [
                    '<%= config.distDir %>/css/*.css'
                ],
                dest: '<%= config.distDir %>/<%= pkg.name %>.css'
            }
        },

        // Minify files with UglifyJS
        // https://github.com/gruntjs/grunt-contrib-uglify
        uglify: {
            options: {
                report: 'min'
            },
            js: {
                files: {
                    '<%= config.distDir %>/<%= pkg.name %>.min.js': '<%= config.distDir %>/<%= pkg.name %>.js'
                }
            }
        },


    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html2js');

    grunt.registerTask('default', [
        'watch'
    ]);

    grunt.registerTask('build', [
        'jshint',
        'clean:build',
        'copy:build',
        'html2js',
        'concat',
        'uglify',
        'clean:postBuild',
    ]);

};
