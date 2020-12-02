var gulp = require("gulp"),
  $ = require("gulp-load-plugins")();

var isProduction = true;

var paths = {
  scripts: "src/",
};

var source = {
  scripts: [
    paths.scripts + "packages.module.js",

    // modules
    paths.scripts + "**/*.module.js",
    paths.scripts + "**/*.js",
  ],
};

var build = {
  dir: "./build",
  src: {
    js: "src.min.js",
  },
  dist: {
    js: "dist.min.js",
  },
};

var cssnanoOpts = {};
var pugOptions = {
  basedir: "./",
};
var tplCacheOptions = {
  root: "scp/packages",
  module: "scp.packages",
};

gulp.task("scripts", function () {
  return gulp
    .src(source.scripts)
    .pipe($.jsvalidate())
    .on("error", handleError)
    .pipe($.concat(build.src.js))
    .pipe($.ngAnnotate())
    .on("error", handleError)
    .pipe(
      $.uglify({
        preserveComments: "some",
      })
    )
    .on("error", handleError)
    .pipe(gulp.dest(build.dir));
});

gulp.task("merge", function () {
  return gulp
    .src([build.dir + "/" + build.src.js])
    .pipe($.concat(build.dist.js))
    .pipe(gulp.dest("./"));
});

gulp.task("default", gulp.series(["scripts", "merge"]));

function handleError(err) {
  log(err.toString());
  this.emit("end");
}

// log to console using
function log(msg) {
  $.util.log($.util.colors.blue(msg));
}
