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
 * -SASS
 * ---SASS:MINIFY
 * ---SASS:WATCH
 * ---SASS:VENDOR
 * ---SASS:VENDOR-MINIFY
 * ---SASS:VENDOR-WATCH
 * ---SASS:BOOTSTRAP
 * -JS
 * ---JS MINIFY
 * ---JS WATCH
 * ---JS VENDOR
 * ---JS VENDOR MINIFY
 * ---JS VENDOR WATCH
 * -JQUERY
 * -IMAGES
 * -FONTS
 * -WEBSERVER
 */


var head = [
    '/*--------------------------------------------------',
    'Website by Websolute',
    '--------------------------------------------------*/'
    ].join('\n');


/***********
*** SASS ***
************/
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
        browsers: ['last 2 versions', 'Explorer >= 10', 'Android >= 4.1', 'Safari >= 7', 'iOS >= 7'],
        cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('./dist/css/'))
   
});

/******************
*** SASS MINIFY ***
******************/
gulp.task('sass:minify', ['sass'], function () {
    console.log('MINIFYING SASS');
    return gulp.src(
        './dist/css/main.css'
    )
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist/css'));
});


/***************** 
*** SASS WATCH *** 
******************/
gulp.task('sass:watch', function () {
    var watcher = gulp.watch('./src/scss/**/*.scss', ['sass']); 
    watcher.on('change', function (e) {
        console.log('watcher.on.change type: ' + e.type + ' path: ' + e.path);
    });
    return watcher;
});


/*****************
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
        browsers: ['last 2 versions', 'Explorer >= 10', 'Android >= 4.1', 'Safari >= 7', 'iOS >= 7'],
        cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('./dist/css/vendor'))

});


/*************************
*** SASS VENDOR MINIFY ***
*************************/
gulp.task('sass:vendor-minify', ['sass:vendor'], function () {
    console.log('MINIFYING VENDOR SASS');
    return gulp.src(
        './dist/css/vendor/**/*.css'
    )
    // minify
    .pipe(cssmin())
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest('./dist/css/vendor'));
});


/************************ 
*** SASS VENDOR WATCH *** 
************************/
gulp.task('sass:vendor-watch', function () {
    var watcher = gulp.watch('./src/scss/vendor/**/*.scss', ['sass:vendor']);
    watcher.on('change', function (e) {
        console.log('watcher.on.change type: ' + e.type + ' path: ' + e.path);
    });
    return watcher;
});


/*********************
*** SASS BOOTSTRAP ***
**********************/
gulp.task('sass:bootstrap', ['sass:vendor-minify'], function () {
    console.log('COMPILING SASS BOOTSTRAP');
    return gulp.src(
        './src/scss/vendor/bootstrap/bootstrap.scss'
        )
        .pipe(plumber(function (error) {
            console.log('sass error: compile plumber', error);
        }))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Explorer >= 10', 'Android >= 4.1', 'Safari >= 7', 'iOS >= 7'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(rename({ dirname: '' }))
        .pipe(gulp.dest('./dist/css/vendor'))
});


/****************
****** JS  ******
*****************/
gulp.task('js', function () {
    console.log('COMPILING MAIN JS');
    return gulp.src(
        './src/js/main.js'
    )
    .pipe(header(head))
    .pipe(plumber(function (error) {
        console.log('js error: compile plumber', error);
    }))
    .pipe(gulp.dest('./dist/js'))
});


/***********************
****** JS MINIFY *******
***********************/
gulp.task('js:minify', ['js'], function () {
    console.log('MINIFY MAIN.JS')
    return gulp.src(
        './dist/js/main.js'
    )
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
})


/**********************
******* JS WATCH ******
***********************/
gulp.task('js:watch', function () {
    var watcher = gulp.watch('./src/js/main.js', ['js']);
    watcher.on('change', function (e) {
        console.log('watcher.on.change type: ' + e.type + ' path: ' + e.path);
    });
    return watcher;
});


/****************
*** JS VENDOR ***
*****************/
gulp.task('js:vendor', function () {
    console.log('COMPILING VENDOR JS');
    return gulp.src(
        './src/js/vendor/**/!(jquery-)*.js'
    )
    .pipe(plumber(function (error) {
        console.log('js error: compile plumber', error);
    }))
    .pipe(gulp.dest('./dist/js/vendor'))
});


/******************************
****** JS VENDOR MINIFY *******
******************************/
gulp.task('js:vendor-minify', ['js:vendor'], function () {
    console.log('MINIFY VENDOR JS')
    return gulp.src(
        './dist/js/vendor/*.js'
    )
    .pipe(uglify())
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('./dist/js/vendor'));
})


/*****************************
******* JS VENDOR WATCH ******
*****************************/
gulp.task('js:vendor-watch', function () {
    var watcher = gulp.watch('./src/js/vendor/**/!(jquery-)*.js', ['js:vendor']);
    watcher.on('change', function (e) {
        console.log('watcher.on.change type: ' + e.type + ' path: ' + e.path);
    });
    return watcher;
});



/************* 
*** JQUERY ***
*************/
gulp.task('jquery', function () {
    return gulp.src('./src/js/vendor/jquery-3.1.0.min.js')
        .pipe(gulp.dest('./dist/js/vendor'));
});


/*************
*** IMAGES ***
**************/
gulp.task('images', function () {
    return gulp.src('./src/img/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'));
});


/************
*** FONTS ***
*************/
gulp.task('fonts', function () {
    return gulp.src('./src/fonts/*')
        .pipe(gulp.dest('./dist/fonts'));
});


/****************
*** WEBSERVER ***
*****************/
gulp.task('webserver', function () {
    return gulp.src('./')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            port: 40000,
            open: true
        }));
});


/************
*** START ***
*************/
gulp.task('start', [
    //CSS
    'sass',
    'sass:watch',
    'sass:vendor',
    'sass:vendor-watch',
    //JS
    'js',
    'js:watch',
    'js:vendor',
    'js:vendor-watch',
    //VARIOUS
    'webserver'
]);


/*************
*** MINIFY ***
**************/
gulp.task('minify', [
    'sass:minify',
    'sass:vendor-minify',
    'js:minify',
    'js:vendor-minify'
]);


/**************
*** PUBLISH ***
**************/
gulp.task('publish', [
    'minify',
    'jquery',
    'images',
    'jquery',
    'fonts'
]);