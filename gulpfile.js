var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoPrefixer = require('gulp-autoprefixer');
var cssComb = require('gulp-csscomb');
var cmq = require('gulp-merge-media-queries');
var cleanCss = require('gulp-clean-css');
var terser = require('gulp-terser');
var concat = require('gulp-concat');

// livereload
var browserSync = require('browser-sync').create();
var portscanner = require('portscanner');
var liveServerPortArray = [3000, 3033, 4000, 5500, 8880, 10000, 9900];

gulp.task('connectDev', function () {
    portscanner.findAPortNotInUse(liveServerPortArray, '127.0.0.1').then(function(port) {
        browserSync.init({
            server: {
                baseDir: ['./demo/']
            },
            port: port
        });
    });
});

gulp.task('sass',function(){
    gulp.src(['src/sass/**/*.scss'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err); // eslint-disable-line no-console
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(cssComb())
        .pipe(cmq({log:true}))
        .pipe(concat({path:'isia-form-repeater.css', stat: { mode: 0666 }})) // eslint-disable-line no-octal
        .pipe(gulp.dest('dist'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCss())
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('demo/css'));
});

gulp.task('js',function(){
    gulp.src(['src/js/**/*.js'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err); // eslint-disable-line no-console
                this.emit('end');
            }
        }))
        .pipe(concat('isia-form-repeater.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(terser())
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('demo/js'));
});

gulp.task('default', [
    'sass',
    'js',
    'connectDev'
],
function(){
    gulp.watch('src/js/**/*.js',['js']);
    gulp.watch('src/sass/**/*.sass',['sass']);
});
