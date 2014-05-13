'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        meta: {
            banner: [
                '/**',
                ' * <%= pkg.description %>',
                ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
                ' * @link <%= pkg.homepage %>',
                ' * @author <%= pkg.author %>',
                ' * @license MIT License, http://www.opensource.org/licenses/MIT',
                ' */\n'
            ].join('\n')
        },

        dirs: {
            dest: 'dist'
        },

        clean: [
            '<%= dirs.dest %>'
        ],

        // Validate files with JSHint.
        // https://github.com/gruntjs/grunt-contrib-jshint
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'src/*.js',
                'test/*.js',
                'Gruntfile.js'
            ]
        },

        concat: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['src/*.js'],
                dest: '<%= dirs.dest %>/<%= pkg.name %>.js'
            }
        },

        recess: {
            build: {
                src: ['src/angular-wizard.less'],
                dest: '<%= dirs.dest %>/<%= pkg.name %>.css',
                options: {
                    compile: true,
                    compress: false,
                    noUnderscores: false,
                    noIDs: false,
                    zeroUnits: false
                }
            },
            compile: {
                src: ['src/angular-wizard.less'],
                dest: '<%= dirs.dest %>/<%= pkg.name %>.min.css',
                options: {
                    compile: true,
                    compress: true,
                    noUnderscores: false,
                    noIDs: false,
                    zeroUnits: false
                }
            }
        },

        copy: {
            less_files: {
                files: [{
                    src: ['src/angular-wizard.less'],
                    dest: '<%= dirs.dest %>',
                    cwd: '.',
                    expand: true,
                    flatten: true
                }]
            }
        },

        html2js: {
            angularwizard: {
                options: {
                    base: 'src'
                },
                src: ['src/*.html'],
                dest: 'src/<%= pkg.name %>.tpls.js'
            },
        },

        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['<%= concat.dist.dest %>'],
                dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
            }
        },

        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            build: {
                singleRun: true,
                autoWatch: false
            },
            travis: {
                singleRun: true,
                autoWatch: false,
                browsers: ['Firefox']
            },
            dev: {
                autoWatch: true
            }
        },

        changelog: {
            options: {
                dest: 'CHANGELOG.md'
            }
        }

    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-recess');

    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', [
        'clean',
        'copy',
        'recess',
        'html2js',
        'concat',
        'uglify',
        'karma:build'
    ]);

    grunt.registerTask('test', ['build']);

    grunt.registerTask('travis', ['build']);

    grunt.registerTask('bump', 'Increment version number', function () {
        var versionType = grunt.option('type');

        function bumpVersion(version, versionType) {
            var type = {
                patch: 2,
                minor: 1,
                major: 0
            },
                parts = version.split('.'),
                idx = type[versionType || 'patch'];
            parts[idx] = parseInt(parts[idx], 10) + 1;
            while (++idx < parts.length) {
                parts[idx] = 0;
            }
            return parts.join('.');
        }
        var version;

        function updateFile(file) {
            var json = grunt.file.readJSON(file);
            version = json.version = bumpVersion(json.version, versionType || 'patch');
            grunt.file.write(file, JSON.stringify(json, null, '  '));
        }
        updateFile('package.json');
        updateFile('bower.json');
        grunt.log.ok('Version bumped to ' + version);
    });

};
