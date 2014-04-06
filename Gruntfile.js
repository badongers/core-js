/*global module:false*/
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: [
                    'src/core.js',
                    'src/events/signal.js',
                    'src/events/eventchannel.js',
                    'src/net/xhr.js',
                    'src/delegates/document.js',
                    'src/delegates/module.js',
                    'src/utils/raf.js'
                ],
                dest: '<%= pkg.name %>.min.js'
            }
        },
        concat: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                src: [
                    'src/core.js',
                    'src/events/signal.js',
                    'src/events/eventchannel.js',
                    'src/net/xhr.js',
                    'src/delegates/document.js',
                    'src/delegates/module.js',
                    'src/utils/raf.js'
                ],
                dest: 'dist/core-concat.js'
            }
        }

    });
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('build', ['uglify']);
    grunt.registerTask('concat', ['concat']);

};
