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
                        'src/core.js',
                        'src/events/eventdispatcher.js',
                        'src/events/eventbroadcaster.js',
                        'src/net/xhr.js',
                        'src/delegates/document.js',
                        'src/delegates/module.js',
                        'src/utils/raf.js',
                        'src/utils/math.js',
                        'src/utils/string.js'
                    ],
                    'dist/<%= pkg.name %>.plugins.min.js':[
                        'addons/core.window.js',
                        'addons/{*,*/}/*.js'
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
                        'src/core.js',
                        'src/events/eventdispatcher.js',
                        'src/events/eventbroadcaster.js',
                        'src/net/xhr.js',
                        'src/delegates/document.js',
                        'src/delegates/module.js',
                        'src/utils/raf.js',
                        'src/utils/math.js',
                        'src/utils/string.js'
                    ],
                    'dist/<%= pkg.name %>.plugins.src.js':[
                        'addons/core.window.js',
                        'addons/{*,*/}/*.js'
                    ]
                }
            }
        }

    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('build', ['uglify', 'concat']);


};
