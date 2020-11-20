let projectFolder = "dist";
let srcFolder = "src";

let path = {
  build: {
    html: projectFolder + "/",
    css: projectFolder + "/css/",
    js: projectFolder + "/js/",
    img: projectFolder + "/img/",
    fonts: projectFolder + "/fonts/",
  },
  src: {
    html: srcFolder + "/*.html",
    css: srcFolder + "/scss/main.scss",
    js: srcFolder + "/js/main.js",
    img: srcFolder + "/img/**/*.{jpg,png,svg,ico,gif,webp}",
    fonts: srcFolder + "/fonts/*.{ttf,woff,woff2}",
  },
  watch: {
    html: srcFolder + "/**/*.html",
    css: srcFolder + "/scss/**/*.scss",
    js: srcFolder + "/js/**/*.js",
    img: srcFolder + "/img/**/*.{jpg,png,svg,ico,gif,webp}",
  },
  clean: "./" + projectFolder + "/",
};

let { src, dest } = require("gulp"),
  gulp = require("gulp"),
  browsersync = require("browser-sync").create(),
  del = require("del"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  groupMedia = require("gulp-group-css-media-queries"),
  cleanCss = require("gulp-clean-css"),
  sourcemaps = require("gulp-sourcemaps"),
  include = require("gulp-include");
//  ttf2woff = require("gulp-ttf2woff"),
//  ttf2woff2 = require("gulp-ttf2woff2");
// webp = require("gulp-webp"),
// webphtml = require("gulp-webp-html");
// webpcss = require("gulp-webpcss");
// imagemin = require("gulp-imagemin"),
// fileInclude = require("gulp-file-include");

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + projectFolder + "/",
    },
    port: 3000,
    notify: false, //turn off notification when browser reloaded
  });
}

function html() {
  return (
    src(path.src.html)
      .pipe(fileInclude()) //to collect html sections
      // .pipe(webphtml())
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
  );
}

function css(params) {
  return (
    src(path.src.css)
      .pipe(sourcemaps.init())
      .pipe(
        sass({
          outputStyle: "expanded",
        })
      )
      .pipe(groupMedia())
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 5 versions"],
          cascade: true,
        })
      )
      // .pipe(webpcss())
      .pipe(cleanCss())
      .pipe(sourcemaps.write("."))
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
  );
}

function js() {
  return src(path.src.js)
    .pipe(
      include({
        includePaths: [__dirname + "/node_modules"],
      })
    ) //to collect js sections
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function images() {
  return (
    src(path.src.img)
      // .pipe(
      //   webp({
      //     qulaity: 70,
      //   })
      // )
      // .pipe(dest(path.build.img))
      // .pipe(src(path.src.img))
      // .pipe(
      //   imagemin({
      //     progressive: true,
      //     svgoPlugins: [{ removeViewBox: false }],
      //     interlaced: true,
      //     optimizationLevel: 3,
      //   })
      // )
      .pipe(dest(path.build.img))
      .pipe(browsersync.stream())
  );
}

function fonts() {
  src(path.src.fonts)
//     .pipe(ttf2woff())
    .pipe(dest(path.build.fonts));
  return src(path.src.fonts)
//     .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts));
}

function clean() {
  return del(path.clean);
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

let build = gulp.series(
  clean,
  html,
  gulp.parallel(js, css, html, images, fonts)
);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;

exports.watch = watch;
exports.default = watch;
