/*jshint node: true */

"use strict";

module.exports = function (grunt) {

// -- Grunt config -------------------------------------------------------------
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    benchmark: {
        all: {
            src : 'src/**/tests/performance/*.js',
            dest: 'performance.csv'
        },

        'gallery-sm-map': {
            src : 'src/sm-map/tests/performance/*.js',
            dest: 'src/sm-map/performance.csv'
        }
    }
});

// -- Tasks --------------------------------------------------------------------

grunt.loadNpmTasks('grunt-benchmark');

};
