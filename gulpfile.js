var concat = require('gulp-concat'),
    gulp = require('gulp'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    // browserify = require('browserify'),
    // ngAnnotate = require('browserify-ngannotate'),
    ngAnnotate = require('gulp-ng-annotate'),
    browserSync = require('browser-sync').create();
    // ngAnnotate = require('gulp-ng-annotate'),

// Concat all JS libraries
gulp.task('js', function() {
    // var b = browserify({
    //   entries: './js/app.js',
    //   debug: true,
    //   paths: ['./js/controllers', './js/services', './js/directives'],
    //   transform: [ngAnnotate]
    // });
    return gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/angular/angular.min.js',
      'bower_components/angular-aria/angular-aria.min.js',
      'bower_components/angular-animate/angular-animate.min.js',
      'bower_components/angular-material/angular-material.min.js',
      'bower_components/angular-route/angular-route.min.js',
      'bower_components/elasticsearch/elasticsearch.angular.js',
      'bower_components/elastic.js/dist/elastic.min.js',
      'bower_components/angular-translate/angular-translate.min.js',
      'bower_components/angular-translate-loader-url/angular-translate-loader-url.min.js',
      'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
      'bower_components/angular-sanitize/angular-sanitize.min.js',
      'js/elasticui.min.js',
      // 'js/app.js',
      'js/filters.js',
      'js/directives.js',
      'js/services.js',
      'views/welcome.js',
      'views/subjects.js',
      // 'views/resources.js',
      'views/resource.js'
     ],
      {base: 'bower_components/'}
    )
    .pipe(concat('all.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

// Concat all CSS files from libs
// gulp.task('css', function() {
//     gulp.src('app/img/layers.png').pipe(gulp.dest('./app/assets/css/images/'))
//     gulp.src('bower_components/font-awesome/fonts/*.*').pipe(gulp.dest('./app/assets/fonts'))
//     return gulp.src([
//         'bower_components/angular-ui-select/dist/select.css',
//         'bower_components/leaflet/dist/leaflet.css',
//         'bower_components/angular-ui-grid/ui-grid.css',
//         'bower_components/font-awesome/css/font-awesome.min.css'
//       ],
//       {base: 'bower_components/'}
//     )
//     .pipe(concat('allcss.css'))
//     .pipe(gulp.dest('./app/assets/css/'));
// });

// Compile less file into CSS
gulp.task('less', function() {
    return gulp.src('css/*.less')
      .pipe(less())
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.stream());
});

// Launch server with livereload
gulp.task('serve', function() {
    browserSync.init({ server: '.' });
    gulp.watch('css/app.less', ['less']);
    gulp.watch('dist/app.css').on('change', browserSync.reload);
    gulp.watch(['js/*.js', 'views/*.js']).on('change', browserSync.reload);
    gulp.watch(['partials/*.html', 'views/*.html']).on('change', browserSync.reload);
});

// gulp.task('prod', function() {
//     return gulp.src(['app/app.js', 'app/controllers/*.js', 'app/services/*.js', 'app/directives/*.js'])
//       .pipe(concat('app.js'))
//       .pipe(ngAnnotate())
//       .pipe(uglify())
//       .pipe(gulp.dest('./app/assets/js'));
// });

// Default task that launch concat js, css & less then launch server
// gulp.task('default', ['js', 'css', 'less', 'serve']);
gulp.task('default', ['js', 'less', 'serve']);