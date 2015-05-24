/*global module:false*/
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            my_target:{
                files:{
                    'dist/<%= pkg.name %>.min.js':[
                        'src/dependencies/sightglass.js',
                        'src/dependencies/rivets.patched.js',
                        'src/core.js',
                        'src/lib/eventdispatcher.js',
                        'src/lib/eventbroadcaster.js',
                        'src/lib/xhr.js',
                        'src/lib/module.js',
                        'src/lib/windowevents.js',
                        'src/lib/document.js',
                        'src/addons/*.js',
                        'src/polyfills/*.js'

                    ],
                    'dist/<%= pkg.name %>.nobinding.min.js':[
                        'src/core.js',
                        'src/lib/eventdispatcher.js',
                        'src/lib/eventbroadcaster.js',
                        'src/lib/xhr.js',
                        'src/lib/module.js',
                        'src/lib/windowevents.js',
                        'src/lib/document.js',
                        'src/addons/*.js',
                        'src/polyfills/*.js'
                    ]
                }
            }
        },
        concat: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            my_target:{
                files:{
                    'dist/<%= pkg.name %>.src.js':[
                        'src/dependencies/sightglass.js',
                        'src/dependencies/rivets.patched.js',
                        'src/core.js',
                        'src/lib/eventdispatcher.js',
                        'src/lib/eventbroadcaster.js',
                        'src/lib/xhr.js',
                        'src/lib/module.js',
                        'src/lib/windowevents.js',
                        'src/lib/document.js',
                        'src/addons/*.js',
                        'src/polyfills/*.js'
                    ],
                    'dist/<%= pkg.name %>.src.nobinding.js':[
                        'src/core.js',
                        'src/lib/eventdispatcher.js',
                        'src/lib/eventbroadcaster.js',
                        'src/lib/xhr.js',
                        'src/lib/module.js',
                        'src/lib/windowevents.js',
                        'src/lib/document.js',
                        'src/addons/*.js',
                        'src/polyfills/*.js'
                    ]

                }
            }
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: ["./src", "./addons"],
                    themedir: './yuidoc-bootstrap',
                    outdir: './documentation'
                }
            }
        }


    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.registerTask('build', ['uglify', 'concat', 'yuidoc']);


};
