module.exports = testFile => {
    console.log(testFile);
    return testFile.replace(/\.test\.js$/, '.js')
        .replace(/\.test\.ts$/, '.ts');
}