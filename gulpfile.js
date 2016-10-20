var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var spritesmith = require('gulp.spritesmith');
var replace = require('gulp-replace');
var merge = require('merge-stream');
var browserSync = require('browser-sync').create();

gulp.task('sass', function(){
	return gulp.src('scss/style.scss')
	.pipe(sass({
		outputStyle: 'expanded'
	}))
	.pipe(replace('sprite.png', '../img/sprite.png'))
	.pipe(postcss([
		autoprefixer({
			browsers: ['> 0%']
		})
	]))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('sprite', function () {
	var spriteData = gulp.src('app/img/sprite/*.png').pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.scss'
	}));

	var imgStream = spriteData.img
		.pipe(gulp.dest('app/img/'));

	var cssStream = spriteData.css
		.pipe(gulp.dest('scss/components/'));

	return merge(imgStream, cssStream);
});

gulp.task('watch', ['browserSync', 'sass', 'sprite'], function(){
	gulp.watch('**/*.scss', ['sass']);
	gulp.watch('app/img/sprite/*.png', ['sprite']);
	gulp.watch('app/*.html', browserSync.reload);
});
gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'app',
			index: "index.html"
		},
	})
});