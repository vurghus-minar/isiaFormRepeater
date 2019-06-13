var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoPrefixer = require('gulp-autoprefixer');
// if node version is lower than v.0.1.2
require('es6-promise').polyfill();
var cssComb = require('gulp-csscomb');
var cmq = require('gulp-merge-media-queries');
var cleanCss = require('gulp-clean-css');
var terser = require('gulp-terser');
var concat = require('gulp-concat');
var pug = require('gulp-pug');
var del = require('del');

// livereload
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var portscanner = require('portscanner');
var liveServerPortArray = [3000, 3033, 4000, 5500, 8880, 10000, 9900];

var options = {
    pluginName: 'isiaFormRepeater',
    usePug: false,
    useThemes: true
};


var dir = {
    srcDir: 'src',
    distDir: 'dist',
    themesLabel: 'themes',
    themesDir: 'src/sass/themes',
    demoDir: 'demo'
};

/**
 * Clean up 
 */
gulp.task('clean', function () {
    return del([
        dir.srcDir + '/css/' + options.pluginName + '.css',
        dir.srcDir + '/css/themes',
        dir.distDir + '/**/*.*',
        dir.distDir + '/themes',
        dir.demoDir + '/public/css/**/*.css',
        dir.demoDir + '/public/css/themes',
        dir.demoDir + '/src/css/' + options.pluginName + '.demo' + '.css',
        dir.demoDir + '/src/css/' + options.pluginName + '.demo.min' + '.css',
        dir.demoDir + '/public/js/**/*.js'
    ]);
});

/**
 * server
 */
gulp.task('connectDev', function () {
    portscanner.findAPortNotInUse(liveServerPortArray, '127.0.0.1').then(function(port) {
        browserSync.init({
            server: {
                baseDir: [dir.demoDir + '/public']
            },
            port: port
        });
    });
});

/**
 * Set up CSS
 */

gulp.task('set_up_css', function () {
    console.log('Compiling main Sass');
    gulp.src([dir.srcDir + '/sass/**/*.scss', '!' + dir.srcDir + '/sass/themes/**/*'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(cssComb())
        .pipe(cmq({log: true}))
        .pipe(concat({path: options.pluginName + '.css', stat: { mode: 0666 }}))
        .pipe(gulp.dest(dir.srcDir + '/css'))
        .on('end', function () {

            console.log('Main Sass compiled successfully');
            console.log('Concatenating source CSS, minifying and moving to dist folder');

            gulp.src([dir.srcDir + '/css/**/*.css', '!' + dir.srcDir + '/css/themes/**/*'])
                .pipe(plumber({
                    handleError: function (err) {
                        console.log(err);
                        this.emit('end');
                    }
                }))
                .pipe(concat(options.pluginName + '.css'))
                .pipe(gulp.dest(dir.distDir))
                .pipe(rename({
                    suffix: '.min'
                }))
                .pipe(cleanCss())
                .pipe(gulp.dest(dir.distDir))
                .on('end', function () {

                    console.log('Successfully concatenated source CSS, minified and moved to dist folder');
                    if (options.useThemes) {
                        console.log('Compiling Theme Sass');
                        gulp.src([dir.themesDir + '/**/*.scss'])
                            .pipe(plumber({
                                handleError: function (err) {
                                    console.log(err);
                                    this.emit('end');
                                }
                            }))
                            .pipe(sass())
                            .pipe(autoPrefixer())
                            .pipe(cssComb())
                            .pipe(cmq({log: true}))
                            .pipe(gulp.dest(dir.distDir + '/themes'))
                            .pipe(rename({
                                prefix: options.pluginName + '.',
                                suffix: '-theme.min'
                            }))
                            .pipe(cleanCss())
                            .pipe(gulp.dest(dir.distDir + '/themes'))
                            .on('end', function () {

                                console.log('Successfully compiled Theme Sass');
                                console.log('Compiling Demo Sass');

                                gulp.src([dir.demoDir + '/src/sass/**/*.scss'])
                                    .pipe(plumber({
                                        handleError: function (err) {
                                            console.log(err);
                                            this.emit('end');
                                        }
                                    }))
                                    .pipe(sass())
                                    .pipe(autoPrefixer())
                                    .pipe(cssComb())
                                    .pipe(cmq({log: true}))
                                    .pipe(concat(options.pluginName + '.' + dir.demoDir + '.css'))
                                    .pipe(gulp.dest(dir.demoDir + '/src/css'))
                                    .pipe(rename({
                                        suffix: '.min'
                                    }))
                                    .pipe(cleanCss())
                                    .pipe(gulp.dest(dir.demoDir + '/src/css'))
                                    .on('end', function(){

                                        console.log('Successfully compiled Demo Sass');
                                        console.log('Moving Demo CSS to Demo public dir');

                                        gulp.src([dir.demoDir + '/src/css/**/*.*.css'])
                                            .pipe(plumber({
                                                handleError: function (err) {
                                                    console.log(err);
                                                    this.emit('end');
                                                }
                                            }))
                                            .pipe(gulp.dest(dir.demoDir + '/public/css'))
                                            .on('end', function(){

                                                console.log('Successfully Moved Demo CSS to Demo public dir');
                                                console.log('Copying Main CSS from dist folder to Demo public dir');

                                                gulp.src([dir.distDir + '/**/*.css'],{'base' : './' + dir.distDir})
                                                    .pipe(plumber({
                                                        handleError: function (err) {
                                                            console.log(err);
                                                            this.emit('end');
                                                        }
                                                    }))
                                                    .pipe(gulp.dest(dir.demoDir + '/public/css'))
                                                    .on('end', function () {

                                                        console.log('Successfully copied Main CSS from dist folder to Demo public dir');
                                                        console.log('Completed CSS Set Up!');

                                                    });

                                            });
                                    });

                            });
                    } else {
                        console.log('Completed CSS Set Up!');
                    }
                });
        });
});

gulp.task('set_up_js', function(){
    console.log('Compiling, minifying and moving source JS');
    gulp.src([dir.srcDir + '/js/**/*.js'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(concat(options.pluginName + '.js'))
        .pipe(gulp.dest(dir.distDir))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(terser())
        .pipe(gulp.dest(dir.distDir))
        .on('end', function () {

            console.log('Successfully compiled, minified and moved source JS');
            console.log('Transpiling ES6 to ES6');

            gulp.src([dir.distDir + '/' + options.pluginName + '.js'])
                .pipe(plumber({
                    handleError: function (err) {
                        console.log(err);
                        this.emit('end');
                    }
                }))
                .pipe(rename({
                    suffix: '.es5'
                }))
                .pipe(gulp.dest(dir.distDir))
                .pipe(rename({
                    suffix: '.min'
                }))
                .pipe(terser())
                .pipe(gulp.dest(dir.distDir))
                .on('end', function(){

                    console.log('Successfully Transpiled ES6 to ES6');
                    console.log('Compiling, minifying and moving demo JS');

                    gulp.src([dir.demoDir + '/src/js/**/*.js'])
                        .pipe(plumber({
                            handleError: function (err) {
                                console.log(err);
                                this.emit('end');
                            }
                        }))
                        .pipe(concat(options.pluginName + '.' + dir.demoDir + '.js'))
                        .pipe(gulp.dest(dir.demoDir + '/public/js'))
                        .pipe(rename({
                            suffix: '.min'
                        }))
                        .pipe(terser())
                        .pipe(gulp.dest(dir.demoDir + '/public/js'))
                        .on('end', function () {
              
                            console.log('Successfully compiled, minified and moved demo JS');
                            console.log('Move dist JS to demo public dir');

                            gulp.src([dir.distDir + '/**/*.js'])
                                .pipe(plumber({
                                    handleError: function (err) {
                                        console.log(err);
                                        this.emit('end');
                                    }
                                }))
                                .pipe(gulp.dest(dir.demoDir + '/public/js'))
                                .on('end', function(){
                                    console.log('Successfully moved dist JS to demo public dir');
                                });

                        });          
                });

        });
});


gulp.task('set_up_demo_pug', function () {
    if (options.usePug) {
        gulp.src([dir.demoDir + '/src/html/*.pug'])
            .pipe(plumber({
                handleError: function (err) {
                    console.log(err);
                    this.emit('end');
                }
            }))
            .pipe(pug())
            .pipe(gulp.dest(dir.demoDir + '/public'));
    }
});

gulp.task('default',
    [
        'set_up_css',
        'set_up_js',
        'set_up_demo_pug',
        'connectDev'
    ],
    function () {

        gulp.watch(dir.srcDir + '/css/**/*.css', ['set_up_css']);
        gulp.watch(dir.srcDir + '/sass/**/*.scss', ['set_up_css']);
        gulp.watch(dir.demoDir + '/src/sass/**/*.scss', ['set_up_css']);

        gulp.watch(dir.srcDir + '/js/**/*.js', ['set_up_js']);
        gulp.watch(dir.demoDir + '/src/js/**/*.js', ['set_up_js']);

        gulp.watch(dir.demoDir + '/public/**/*.*', reload);

    }
);