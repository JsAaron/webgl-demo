var gulp = require('gulp');
var webpack = require('webpack');
var notify = require('gulp-notify');

//http://www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: '编译错误',
        message: '<%= error.message %>'
    }).apply(this, args);
    this.emit('end');
};


var srcRoot = "./src/";
var destRoot = "./demo/"

//监控原src变化
var watchJs = srcRoot + '**/*.js';
//配置server 
var webServer = {
    server    : destRoot,
    index     : 'index.html',
    port      : 3000,
    logLevel  : "debug",
    logPrefix : "Aaron",
    open      : false
}


//监控脚本变化
gulp.task('watch', function() {
    //监控src改变
    gulp.watch(watchJs, ['pack']);
    //监控pixi改变
    //刷新加载
    // gulp.watch(destRoot + "pixi.js").on('change', function(){
    //      reload();
    // });

    gulp.watch(destRoot + "**/*.js").on('change', function(){
         reload();
    });

})


// web服务 Server + watching scss/html files
gulp.task('web-server', function() {
    browserSync.init(webServer);
});


//pixi打包
gulp.task('pack', function() {
    webpack({
        // watch  : true,
        entry: './src/index.js',
        output: {
            path: './demo/',
            publicPath: './demo/',
            filename: 'pixi.js'
        },
        devtool: '#source-map',
        //加载器
        module: {
            loaders: [{
                test: /\.css$/,
                loader: 'style!css!sass'
            }, {
                test: /\.sass$/,
                loader: 'style!css!sass'
            }, {
                test: /\.scss$/,
                loader: 'style!css!sass'
            }, {
                test: /\.styl$/,
                loader: "style!css!stylus"
            }, {
                test: /\.html$/,
                loader: "html"
            }],
            preLoaders: [{
                test: /\.js$/,
                loader: "source-map-loader"
            }, {
                test: /\.js$/, // include .js files
                exclude: /node_modules/, // exclude any and all files in the node_modules folder
                loader: "jshint-loader"
            }]
        }
    }, function(err, stats) {
        if (err) {
            handleErrors();
        }
    });
})


gulp.task('default', ['web-server','pack','watch'])
