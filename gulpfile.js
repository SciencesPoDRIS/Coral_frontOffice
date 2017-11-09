var concat = require('gulp-concat'),
    gulp = require('gulp'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    browserSync = require('browser-sync').create(),
    cleanCSS = require('gulp-clean-css');

// Concat and minify all JS libraries
gulp.task('js', function() {
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
      'js/filters.js',
      'js/directives.js',
      'js/services.js',
      'views/welcome.js',
      'views/subjects.js',
      'views/resource.js'
     ],
      {base: 'bower_components/'}
    )
    .pipe(concat('all.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

// Compile less file into CSS
gulp.task('less', function() {
    return gulp.src('css/*.less')
      .pipe(less())
      .pipe(gulp.dest('css'))
      .pipe(browserSync.stream());
});

// Concat and minify all CSS files
gulp.task('css', ['less'], function() {
    return gulp.src([
        'bower_components/angular-material/angular-material.min.css',
        'bower_components/material-design-icons/iconfont/material-icons.css',
        'css/app.css'
    ])
    .pipe(concat('all.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'));
});

// Copy one image and the fonts into the assets folder
gulp.task('assets', function() {
    // Translation files
    gulp.src('languages/*.json')
      .pipe(gulp.dest('dist/languages'));
    // Angular Material fonts
    gulp.src([
      'bower_components/material-design-icons/iconfont/MaterialIcons-Regular.woff',
      'bower_components/material-design-icons/iconfont/MaterialIcons-Regular.woff2',
      'bower_components/material-design-icons/iconfont/MaterialIcons-Regular.ttf',
      'fonts/georgia.ttf'
    ]).pipe(gulp.dest('dist/css'));
    // Other JS files that cannot be concatened
    gulp.src([
      'js/app.js',
      'views/resources.js'
    ]).pipe(gulp.dest('dist/js'));
});

// Launch server with livereload
gulp.task('serve', function() {
    browserSync.init({ server: '.' });
    gulp.watch('css/app.less', ['less']);
    gulp.watch('dist/app.css').on('change', browserSync.reload);
    gulp.watch(['js/*.js', 'views/*.js'], ['js']);
    gulp.watch(['js/app.js', 'views/resources.js', 'dist/all.min.js']).on('change', browserSync.reload);
    gulp.watch(['partials/*.html', 'views/*.html']).on('change', browserSync.reload);
});

// Default task that launch concat js and css, then copy some assets and launch the server with livereload
gulp.task('default', ['js', 'css', 'assets', 'serve']);