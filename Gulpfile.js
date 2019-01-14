'use strict';

var es6promise = require('es6-promise'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    rename = require("gulp-rename"),
    sourcemaps = require('gulp-sourcemaps'),
    header = require('gulp-header'),
    autoprefixer = require('gulp-autoprefixer'),
    webserver = require('gulp-webserver'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat');

/*
* sass
* sass:vendor
* sass:watch
* css
* css:watch
* css:minify
* css:vendor-minify
* js
* js:vendor
* js:watch
* js:minify
* js:vendor-minify
* tfs
* checkout:css
* checkout:js
* checkout:all
* minify
* webserver
*/


var head = [
    '/*--------------------------------------------------',
    'Website by Websolute',
    '--------------------------------------------------*/'
    ].join('\n');


/***********
*** SASS ***
***********/
gulp.task('sass', function () {
    console.log('COMPILING SASS');
    return gulp.src(
        './src/scss/main.scss'
    )
    .pipe(plumber(function (error) {
        console.log('sass error: compile plumber', error);
    }))
    .pipe(header(head))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions', 'Explorer >= 11', 'Android >= 4.1', 'Safari >= 7', 'iOS >= 7'],
        cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('./dist/css/')) 
});


/******************
*** SASS VENDOR ***
******************/
gulp.task('sass:vendor', function () {
    console.log('COMPILING SASS VENDOR');
    return gulp.src(
        './src/scss/vendor/**/*.scss'
    )
    .pipe(plumber(function (error) {
        console.log('sass error: compile plumber', error);
    }))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions', 'Explorer >= 11', 'Android >= 4.1', 'Safari >= 7', 'iOS >= 7'],
        cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('./dist/css/vendor'))
});


/***************** 
*** SASS WATCH *** 
*****************/
gulp.task('sass:watch', function () {
    var watcher = gulp.watch('./src/scss/**/*.scss', ['css:minify']);
    watcher.on('change', function (e) {
        console.log('watcher.on.change type: ' + e.type + ' path: ' + e.path);
    });
    return watcher;
});


/************
*** CSS *****
************/
gulp.task('css', function () {
    return gulp.src('./src/css/**/*.css')
        .pipe(gulp.dest('./dist/css/'));
});


/****************** 
**** CSS WATCH **** 
******************/
gulp.task('css:watch', function () {
    var watcher = gulp.watch('./src/css/**/*.css', ['css:minify']);
    watcher.on('change', function (e) {
        console.log('watcher.on.change type: ' + e.type + ' path: ' + e.path);
    });
    return watcher;
});


/******************
**** CSS MINIFY ***
******************/
gulp.task('css:minify', ['css', 'sass'], function () {
    console.log('MINIFYING CSS');
    return gulp.src([
        './dist/css/**/*.css',
        '!./dist/css/main.css',
        '!./dist/css/vendor/**/*.css',
        './dist/css/main.css'
    ])
    .pipe(cssmin())
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('./dist/css'));
});


/*************************
**** CSS VENDOR MINIFY ***
*************************/
gulp.task('css:vendor-minify', ['sass:vendor'], function () {
    console.log('MINIFYING VENDOR CSS');
    return gulp.src(
        './dist/css/vendor/**/*.css'
    )
    // minify
    .pipe(cssmin())
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest('./dist/css/vendor'));
});


/****************
****** JS  ******
****************/
gulp.task('js', function () {
    console.log('COMPILING JS');
    return gulp.src([
        './src/js/**/*.js',
        '!./src/js/vendor/**/*.js'
    ])
    .pipe(header(head))
    .pipe(plumber(function (error) {
        console.log('js error: compile plumber', error);
    }))
    .pipe(gulp.dest('./dist/js'))
});


/****************
*** JS VENDOR ***
****************/
gulp.task('js:vendor', function () {
    console.log('COMPILING VENDOR JS');
    return gulp.src(
        './src/js/vendor/**/*.js'
    )
    .pipe(plumber(function (error) {
        console.log('js error: compile plumber', error);
    }))
    .pipe(gulp.dest('./dist/js/vendor'))
});


/**********************
******* JS WATCH ******
**********************/
gulp.task('js:watch', function () {
    var watcher = gulp.watch([
        './src/js/**/*.js',
        '!./src/js/vendor/**/*.js'
    ], ['js:minify']);
    watcher.on('change', function (e) {
        console.log('watcher.on.change type: ' + e.type + ' path: ' + e.path);
    });
    return watcher;
});


/***********************
****** JS MINIFY *******
***********************/
gulp.task('js:minify', ['js'], function () {
    console.log('MINIFY JS')
    return gulp.src([
        './src/js/**/*.js',
        '!./src/js/main.js',
        '!./src/js/vendor/**/*.js',
        './src/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify().on('error', function (e) {
        console.log(e);
    }))
    .pipe(gulp.dest('./dist/js'))
})


/******************************
****** JS VENDOR MINIFY *******
******************************/
gulp.task('js:vendor-minify', ['js:vendor'], function () {
    console.log('MINIFY VENDOR JS')
    return gulp.src([
        './dist/js/vendor/!(jquery-)*.js'
    ])
    .pipe(uglify().on('error', function (e) {
        console.log(e);
    }))
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('./dist/js/vendor'));
})


/***********************
*** TFS CSS CHECKOUT ***
***********************/
gulp.task('checkout:css', function () {
    return gulp.src([
        './dist/css/*.css'
    ])
      .pipe(tfs.checkout())
});


/***********************
*** TFS JS CHECKOUT ***
***********************/
gulp.task('checkout:js', function () {
    return gulp.src([
        './dist/js/*.js',
    ])
    .pipe(tfs.checkout())
});


/***********************
*** TFS CHECKOUT ALL ***
***********************/
gulp.task('checkout:all', function () {
    return gulp.src([
        './dist/css/*.css',
        './dist/css/**/.css',
        './dist/js/*.js',
        './dist/js/**/*.js',
    ])
    .pipe(tfs.checkout())
});


/*************
*** MINIFY ***
*************/
gulp.task('minify', [
    'css:minify',
    'css:vendor-minify',
    'js:minify',
    'js:vendor-minify'
]);


/****************
*** WEBSERVER ***
****************/
gulp.task('webserver', function () {
    return gulp.src('./')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            port: 40000,
            open: true
        }));
});


/**************
*** DEFAULT ***
**************/
gulp.task('default', [
    //build and minify
    'minify',
    //vendor
    'sass:vendor',
    'js:vendor',
    //watch
    'sass:watch',
    'css:watch',
    'js:watch',
    //VARIOUS
    'webserver'
]);
