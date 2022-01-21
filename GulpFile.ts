const gulp = require("gulp");
const {series} = gulp;
const ts = require("gulp-typescript");

function build() {
    let tsProject = ts.createProject("tsconfig.json");
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("build/code"));
}

function copyResources() {
    return gulp.src("src/resources/**/*").pipe(gulp.dest("build/resources"));
}

gulp.task("default", series(build, copyResources));