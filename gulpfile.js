var
    gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    gcmq = require('gulp-group-css-media-queries'),
    babel = require('gulp-babel'),
    autoprefixer = require('gulp-autoprefixer'),
    pug = require('gulp-pug'),
    prettify = require('gulp-jsbeautifier'),
    flatten = require('gulp-flatten'),
    empty = require('gulp-empty'),
    plumber = require('gulp-plumber'),
    env = require('gulp-env'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    imageminPngquant = require('imagemin-pngquant'),
    cleanCSS = require('gulp-clean-css'),
    htmlmin = require('gulp-htmlmin');

var
    srcPath = 'src/',
    buildPath = 'build/',libsPath = srcPath + 'js/libs/**/*.js',
    pathways = {
        pages: srcPath + 'views/pages/**/*.pug',
        layouts: srcPath + 'views/layouts/*.pug',
        blocks: srcPath + 'blocks/**/*.pug',
        styles: [
            srcPath + 'sass/helpers/*.{css,scss}', srcPath + 'sass/**/*.{css,scss}', srcPath + 'sass/*.css' , srcPath + 'sass/*.scss' , srcPath + 'views/pages/**/*.{css,scss}', srcPath + 'blocks/**/*.{css,scss}'
        ],
        scripts: [
            '!' + srcPath + 'js/libs/*.js', '!' + srcPath + 'js/libs/**/*.js', srcPath + 'blocks/**/*.js', srcPath + 'js/*.js',
        ],
        images: [
            srcPath + 'img/**/*.{png,jpg,jpeg,gif,svg}', srcPath + 'img/*.{png,jpg,jpeg,gif,svg}', srcPath + 'blocks/**/*.{png,jpg,jpeg,gif,svg}'
        ],
        systemImages: [
            srcPath + 'views/layouts/*.{png,jpg,jpeg,gif,svg}'
        ],
        fonts: srcPath + 'fonts/',
    };

//SASS
gulp.task('sass', function () {
    return gulp.src(pathways.styles)
        .pipe(plumber())
        .pipe(concat('style.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions', 'ie >= 11', 'Safari >= 6'],
            cascade: false
        })) 
        .pipe(gcmq()) 
        
        .pipe(process.env.NODE_ENV === 'production' ? 
            cleanCSS()
        : empty())
        .pipe(gulp.dest(buildPath + 'css/'))
        .pipe(plumber.stop())
        .pipe(process.env.NODE_ENV !== 'production' ?  reload({
            stream: true
        }): empty())
});
  

// JS
gulp.task('js', function () {
    return gulp.src(pathways.scripts)
        .pipe(plumber())
        .pipe(babel({
            presets: ['@babel/preset-env'],
        }))
        .pipe(concat('app.js'))
        .pipe(process.env.NODE_ENV === 'production' ? uglify() : empty())
        .pipe(gulp.dest(buildPath + 'js/'))
        .pipe(plumber.stop())
        .pipe(process.env.NODE_ENV !== 'production' ? reload({
            stream: true
        }): empty())
});


// animationJS
gulp.task('animationcall', function () {
    return gulp.src(pathways.animationscall)
        .pipe(plumber())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(process.env.NODE_ENV === 'production' ? uglify() : empty())
        .pipe(gulp.dest(buildPath + 'js/animation/'))
        .pipe(plumber.stop())
        .pipe(process.env.NODE_ENV !== 'production' ? reload({
            stream: true
        }): empty())
});

//Libs
gulp.task('jsLibs', function () {
    return gulp.src(libsPath)
        .pipe(plumber())
        .pipe(flatten())
        .pipe(gulp.dest(buildPath + 'js/libs'))
        .pipe(plumber.stop())
        .pipe(process.env.NODE_ENV !== 'production' ? reload({
            stream: true
        }): empty())
});

//IMAGES
gulp.task('images', function () {
    return gulp.src(
            pathways.images
        )
        .pipe(plumber())
        .pipe(gulp.dest(buildPath + 'img/'))
        .pipe(process.env.NODE_ENV === 'production' ? 
            imagemin([
                imageminJpegRecompress({
                  progressive: true,
                  max: 80,
                  min: 70
                }),
                imageminPngquant([0.7, 0.8]),
                imagemin.svgo({plugins: [{removeViewBox: true}]})
            ]) : empty())
        .pipe(gulp.dest(buildPath + 'img/'))
        .pipe(plumber.stop());
});


//SystemIMAGES
gulp.task('systemImages', function () {
    return gulp.src(
            pathways.systemImages
        )
        .pipe(plumber())
        .pipe(gulp.dest(buildPath))
        .pipe(process.env.NODE_ENV === 'production' ?
            imagemin([
                imageminJpegRecompress({
                    progressive: true,
                    max: 80,
                    min: 70
                }),
                imageminPngquant([0.7, 0.8]),
                imagemin.svgo({
                    plugins: [{
                        removeViewBox: true
                    }]
                })
            ]) : empty())
        .pipe(gulp.dest(buildPath))
        .pipe(plumber.stop());
});

//FONTS
gulp.task('fonts', function () {
    return gulp.src([
            pathways.fonts + '**/*.*'
        ])
        .pipe(plumber())
        .pipe(gulp.dest(buildPath + 'css'))
        .pipe(plumber.stop());
});

// pages
gulp.task('pages', function () {
    return gulp.src(pathways.pages)
        .pipe(flatten())
        .pipe(plumber())
        .pipe(pug({}, {}, {
            ext: '.html'
        }))
        .pipe(prettify({
            'indent_size': 2,
            'indent_char': ' '
        }))
        .pipe(process.env.NODE_ENV === 'production' ? htmlmin({
            collapseWhitespace: true,
            removeComments: true,
        }) : empty())
        .pipe(gulp.dest(buildPath))
        .pipe(plumber.stop())
        .pipe(process.env.NODE_ENV !== 'production' ? reload({
            stream: true
        }): empty());
});

// CLEAN build directory
gulp.task('clean', function () {
    return gulp.src(['./build'], {
            read: false,
            allowEmpty: true 
        })
        .pipe(plumber())
        .pipe(clean())
        .pipe(plumber.stop());
});

// browserSync
gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: buildPath
        },
        port: 3005,
        open: true,
        notify: false
    });
});

gulp.task('watch', function () {
    gulp.watch(pathways.styles, gulp.parallel('sass'));
    gulp.watch(pathways.scripts, gulp.parallel('js'));
    gulp.watch(pathways.images, gulp.parallel('images'));
    gulp.watch(pathways.fonts + '**/*.*', gulp.parallel('fonts'));
    gulp.watch([pathways.pages, pathways.layouts, pathways.blocks], gulp.parallel('pages'));

});


function setDevelopment(cb) {
    const envs = env.set({
        NODE_ENV: 'development'
    });
    cb()
}

function setProduction(cb) {
    const envs = env.set({
        NODE_ENV: 'production'
    });
    cb()
}


var tasks = {
    development: ['sass', 'js', 'jsLibs', 'systemImages',
        'images', 'fonts', 'pages', 'watch', 'browserSync'
    ],
    production: ['sass', 'js', 'jsLibs', 'systemImages', 'images', 'fonts', 'pages']
};

gulp.task('default', gulp.series('clean', setDevelopment, gulp.parallel(...tasks.development)));

gulp.task('build', gulp.series('clean', setProduction, gulp.parallel(...tasks.production)));