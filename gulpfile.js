var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sass = require('gulp-sass'),
    webpack = require('webpack-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    merge = require('merge2'),
    notify  = require("gulp-notify"),
    plumber = require('gulp-plumber');


/*---------*/
/*  SETUP  */
/*---------*/

var PATH = {
    app: "./app",
    dev: "./builds/development",
    prod: "./builds/production"
}

var sassPrefix = [
    "Android 2.3",
    "Android >= 4",
    "Chrome >= 20",
    "Firefox >= 24",
    "Explorer >= 9",
    "iOS >= 6",
    "Opera >= 12",
    "Safari >= 6"
];

var notifyError =  notify.onError({
    "title": "ERROR",
    "message": "Error: <%= error.message %>"
});


/* ------- */
/*  TASKS  */
/* ------- */

// Typings install
gulp.task('typings', function() {

     return gulp.src("./typings.json")
        .pipe(plumber({ errorHandler: notifyError }))
        .pipe( require('gulp-typings')() )
        .pipe(notify({ message: 'Typings complete', onLast: true }));

})

// Webpack bundle
gulp.task('webpack', function() {
    
    return gulp.src( PATH.dev + "/index.js" )
        .pipe(plumber({ errorHandler: notifyError }))
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(notify({ message: 'Webpack complete', onLast: true }));
    
});

// TypeScript
gulp.task('ts', function() {

    var tsProject = ts.createProject('./ts.config.json');
    var tsResult = gulp.src( PATH.app + "/**/*.ts" )
        .pipe(plumber({ errorHandler: notifyError }))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));
    
    return merge([
        tsResult.dts.pipe(gulp.dest( PATH.dev + '/js/definitions')),
        tsResult.js.pipe(gulp.dest( PATH.dev + '/js' ))
            .pipe(notify({ message: 'TypeScript complete', onLast: true }))
    ]);

});

// SASS
gulp.task('sass', function () {

    return gulp.src( PATH.app + '/sass/*.scss' )
        .pipe(plumber({ errorHandler: notifyError }))
        .pipe(sourcemaps.init())

        // Filename
        .pipe(concat('main.css'))

        .pipe(sass({ outputStyle: 'nested' }))
        .pipe(autoprefixer({ browsers: sassPrefix }))
        .pipe(sourcemaps.write('.'))  // outputs to PATH.sass
        .pipe(gulp.dest( PATH.dev + "/css" ))
        .pipe(notify({ message: 'SASS complete', onLast: true }));

});


/* ------- */
/*  WATCH  */
/* ------- */

gulp.task('watch', function () {

    // Watch Sass files and execute using 'sass'
    gulp.watch(PATH.app + '/**/*.scss', ['sass'])
        .on("change", function (event) {
            console.log('[SASS] File ' + event.path.replace(/^.*(\\|\/|\:)/, '') + ' was ' + event.type + ', compiling...');
        });
    

    // Watch typescript files and execute using 'ts'
    gulp.watch(PATH.app + '/**/*.ts', ['ts'])
        .on("change", function (event) {
            console.log('[TYPESCRIPT] File ' + event.path.replace(/^.*(\\|\/|\:)/, '') + ' was ' + event.type + ', compiling...');
        });

});


gulp.task('default', ['watch']);
    