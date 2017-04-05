var gulp = require('gulp');
var sass = require('gulp-sass');

var browserSync = require('browser-sync').create();

//gulp buildSass
gulp.task('buildSass', function() {
  // buildSass
  gulp.src('src/sass/*.scss')
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(gulp.dest('src/css'));
		// .pipe(browserSync.stream());
});

gulp.task('watchFile',['buildSass'],function(){
	// browserSync.init({
	// 	server:'./src',
	// 	index:'/html/login.html'
	// });

	gulp.watch('src/sass/*.scss',['buildSass']);
	// gulp.watch('src/js/*.js',['changeJS']);
	// gulp.watch('src/html/*.html').on('change',browserSync.reload);
});

// gulp.task('changeJS',function(){
// 	gulp.src('src/js/test.js')
// 		.pipe(browserSync.stream());
// })