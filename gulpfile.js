require('dotenv').config();
const gulp = require('gulp');

gulp.task('clean', function() {
    return require('del')('dist');
});

gulp.task('build:styles:sass', function () {
    const sass = require('gulp-sass');
    sass.compiler = require('node-sass');

    return gulp.src('src/client/css/**/*.{sass,scss}')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/client/css'));
});
gulp.task('build:styles:css', function () {
    const sourcemaps = require('gulp-sourcemaps')

    return gulp.src('dist/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(require('gulp-postcss')([
            require('tailwindcss')('tailwind.config.js'),
            require('autoprefixer')
        ]))
        .pipe(require('gulp-clean-css')())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build:ts:server', function() {
    const ts = require('gulp-typescript');
    const server = ts.createProject('tsconfig.json');

    return gulp.src(["src/**/*.ts", "!src/public/**/*.*"])
        .pipe(server())
        .pipe(gulp.dest('dist'));
})
gulp.task('build:ts:client', function() {
    const ts = require('gulp-typescript');
    const server = ts.createProject('src/client/tsconfig.json');

    return gulp.src("src/client/ts/**/*.{ts,tsx}")
        .pipe(server())
        .pipe(gulp.dest('dist/client/js-pre'));
});
gulp.task('build:ts:client', function() {
    const webpack = require('webpack-stream');

    return gulp.src("src/client/js-pre/**/*.js")
        .pipe(webpack(require('./webpack.config')))
        .pipe(gulp.dest('dist/client/js'));
});

gulp.task('build:styles', gulp.series('build:styles:sass', 'build:styles:css'));
gulp.task('build:ts', gulp.series(gulp.parallel('build:ts:server', 'build:ts:client')));
gulp.task('build:views', function() {
    return gulp.src("src/server/views/**/*.ejs")
        .pipe(gulp.dest("dist/server/views"));
});
gulp.task('build:js', function() {
    return gulp.src("src/client/js/**/*.js")
        .pipe(gulp.dest("dist/client/js"));
});
gulp.task('build:static', function() {
    return gulp.src("src/server/resources/**/*.*")
        .pipe(gulp.dest("dist/server/resources"));
});

gulp.task('watch:styles', function(done) {
    gulp.watch('src/client/**/*.{scss,sass,css}', gulp.series('build:styles'));
    done();
});
gulp.task('watch:ts', function(done) {
    gulp.watch('src/**/*.{ts,tsx}', gulp.series('build:ts'));
    done();
});
gulp.task('watch:views', function(done) {
    gulp.watch('src/server/views/**/*.ejs', gulp.series('build:views'))
    done();
});
gulp.task('watch:js', function(done) {
    gulp.watch("src/client/js/**/*.js", gulp.series('build:js'));
    done();
});

gulp.task('build', gulp.parallel('build:styles', 'build:ts', 'build:js', 'build:views', 'build:static'))
gulp.task('watch', gulp.parallel('watch:styles', 'watch:ts', 'watch:js', 'watch:views'));
gulp.task('server', function(done) {
    var called = false;
    return require('nodemon')({
        script: "dist/server/server.js"
    }).on('start', function() {
            if (!called) {
                called = true;
                done();
            }
        });
});

gulp.task('default', gulp.series('clean', 'build', 'server', 'watch'));