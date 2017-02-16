var gulp = require('gulp'),
server = require('gulp-server-livereload'),
less = require('gulp-less'),
watch = require('gulp-watch'),
concat = require('gulp-concat'),
htmlmin = require('gulp-htmlmin'),
rename = require('gulp-rename'),  
uglify = require('gulp-uglify'), 
exec = require('gulp-exec'),
runSequence = require('run-sequence'), 
inject = require('gulp-inject'),
LessPluginCleanCSS = require('less-plugin-clean-css'),
LessPluginAutoPrefix = require('less-plugin-autoprefix'),
cleancss = new LessPluginCleanCSS({ advanced: true }),
autoprefix = new LessPluginAutoPrefix({ 
	browsers: ["> 0%"]
});

//var imagemin = require('gulp-imagemin');


gulp.task('less', function () {
	return gulp.src('less/main.less')
		  .pipe(less({
		    plugins: [autoprefix]
		  }))
		.pipe(gulp.dest('app/assets/css'));
});

gulp.task('serve',['watch'], function() {
  gulp.src('app/')
    .pipe(server({
      livereload: true,
      open: true
    }));
});

gulp.task('watch', function() {
	gulp.watch('less/*.less', ['less']);
});


//script paths
var jsFilesModules = 'app/modules/**/*.js',  
	jsFilesJSlibs = 'app/libs/*.js',
    jsFilesCsslibs = 'app/libs/*.css',
    assets = 'app/assets/**',
    mainJs = 'app/app.js',
    prototypeJs = 'app/modules/**/*Prototype.js',
    jsDest = 'dist',
    devePlace = 'app/**';
 
gulp.task('minImages', function(){
     gulp.src('app/assets/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/images'))
});


gulp.task('copyAssets', function() {  
    return gulp.src(assets)
        .pipe(gulp.dest(jsDest+'/assets'));
});

gulp.task('copylibCssFiles', function() {  
    return gulp.src(jsFilesCsslibs)
        .pipe(gulp.dest(jsDest+'/libs'));
});

gulp.task('copylibJSFiles', function() {  
    return gulp.src(jsFilesJSlibs)
        .pipe(gulp.dest(jsDest+'/libs'));
});

gulp.task('minifyJS', function() {  
    return gulp.src([mainJs,prototypeJs,jsFilesModules])
        .pipe(concat('vendor.js'))
        .pipe(rename('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

gulp.task('copyIndex', function() {
    return gulp.src('app/index.html.dist')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist'));
});

gulp.task('copyHTML',['copyIndex'], function() {
    return gulp.src('app/modules/**/views/**')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/modules'));
});

gulp.task('giveBuild',['copyAssets','minifyJS','copylibJSFiles','copylibCssFiles','copyIndex','copyHTML']);

gulp.task('copyFiles',function(){
    return gulp.src(devePlace)
    .pipe(gulp.dest('/'));
});

var exec = require('child_process').exec;

gulp.task('cordova', function(done) {
  exec('corodva run', { cwd: '../CombatPhoneGap', stdio: 'inherit' })
    .on('close', done);
});

gulp.task('build',['copyFiles','cordova']);

