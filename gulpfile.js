var gulp = require('gulp'),
    concat = require('gulp-concat'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require('merge2'),
    gulpTypings = require('gulp-typings'),
    webpack = require('webpack-stream'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    notify  = require("gulp-notify"),
    plumber = require('gulp-plumber');


/*---------*/
/*  SETUP  */
/*---------*/

var PATH = {
    // in
    ts: './client/src', 
    sass: './client/sass', 
    // out
    js: './client/build',
    css: './client/build/',
    webpack: "./public/dist/js"
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

     return gulp.src("typings.json")
        .pipe(gulpTypings()); //will install all typingsfiles in pipeline. =]

})

// Webpack
gulp.task('ng-bundle', function() {
    
    return gulp.src( PATH.js + "/index.js" )
        .pipe(plumber({ errorHandler: notifyError }))
        .pipe(webpack())
        .pipe(gulp.dest( PATH.webpack ))
        .pipe(notify({ message: 'Webpack complete', onLast: true }));
    
});

// TypeScript
gulp.task('ng-ts', function() {

    var tsProject = ts.createProject('client/tsconfig.json');
    var tsResult = gulp.src(PATH.ts + "/**/*.ts")
        .pipe(plumber({ errorHandler: notifyError }))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));
    
    return merge([
        tsResult.dts.pipe(gulp.dest( PATH.js + '/definitions')),
        tsResult.js.pipe(gulp.dest( PATH.js ))
            .pipe(notify({ message: 'TypeScript complete', onLast: true }));
    ])

});

// SASS
gulp.task('sass', function () {

    return gulp.src(PATH.sass + '/*.scss')
        .pipe(plumber({ errorHandler: notifyError }))
        .pipe(sourcemaps.init())

        // Filename
        .pipe(concat('main.css'))

        .pipe(sass({ outputStyle: 'nested' }))
        .pipe(autoprefixer({ browsers: sassPrefix }))
        .pipe(sourcemaps.write('./'))  // outputs to PATH.sass
        .pipe(gulp.dest(PATH.css))
        .pipe(notify({ message: 'SASS complete', onLast: true }));

});


/* ------- */
/*  WATCH  */
/* ------- */

gulp.task('watch', function () {

    // Watch Sass files and execute using 'sass'
    gulp.watch(PATH.sass + '/**/*.scss', ['sass'])
        .on("change", function (event) {
            console.log('[SASS] File ' + event.path.replace(/^.*(\\|\/|\:)/, '') + ' was ' + event.type + ', compiling...');
        });
    

    // Watch typescript files and execute using 'ng-ts'
    gulp.watch(PATH.ts + '/**/*.ts', ['ng-ts'])
        .on("change", function (event) {
            console.log('[TYPESCRIPT] File ' + event.path.replace(/^.*(\\|\/|\:)/, '') + ' was ' + event.type + ', compiling...');
        });

});

gulp.task('default', ['ng-bundle']);






    