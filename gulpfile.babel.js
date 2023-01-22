import gulp from "gulp";
import gulpSass from "gulp-sass";
import nodeSass from "node-sass";
import autoprefixer from "gulp-autoprefixer";
import minifyCSS from "gulp-csso";
import {deleteAsync} from "del";
import bro from "gulp-bro";
import babel from "babelify";

const sass = gulpSass(nodeSass);

const paths = {
  styles: {
    src: "assets/scss/styles.scss",
    dest: "src/static/styles",
    watch: "assets/scss/**/*.scss"
  },
  js: {
    src: "assets/js/main.js",
    dest: "src/static/js",
    watch: "assets/js/**/*.js"
  }
}

const clean = () => deleteAsync(["src/static"]);

const styles = () => gulp
  .src(paths.styles.src)
  .pipe(sass())
  .pipe(
    autoprefixer({
      cascade: false
    })
  )
.pipe(minifyCSS())
.pipe(gulp.dest(paths.styles.dest));

const js = () => gulp
  .src(paths.js.src)
  .pipe(
    bro({
      transform: [
        babel.configure({
          presets: ["@babel/preset-env"]
        }),
        ["uglifyify", { global: true }]
      ]
    })
  )
  .pipe(gulp.dest(paths.js.dest));

const watchFiles = () => {
  gulp.watch(paths.styles.watch, styles);
  gulp.watch(paths.js.watch, js);
}

const dev = gulp.series(clean, styles, js, watchFiles);

export const build = gulp.series(clean, styles, js);
// 이것만 써주고 build 할 수 있음, watchFile은 안넣어줘도 됨
export default dev;