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
                        'src/events/signal.js',
                        'src/events/eventchannel.js',
                        'src/net/xhr.js',
                        'src/delegates/document.js',
                        'src/delegates/module.js',
                        'src/utils/raf.js'
                    ],
                    'dist/<%= pkg.name %>.plugins.min.js':[
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
                        'src/events/signal.js',
                        'src/events/eventchannel.js',
                        'src/net/xhr.js',
                        'src/delegates/document.js',
                        'src/delegates/module.js',
                        'src/utils/raf.js'
                    ],
                    'dist/<%= pkg.name %>.plugins.src.js':[
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
