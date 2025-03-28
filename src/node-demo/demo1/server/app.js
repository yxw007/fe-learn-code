/**
 * 服务入口
 */
var http = require('http');
var koaStatic = require('koa-static');
var path = require('path');
var koaBody = require('koa-body');
var Koa = require('koa');


var app = new Koa();
var port = process.env.PORT || '8100';

var uploadHost= `http://localhost:${port}/uploads/`;

app.use(koaBody({
    formidable: {
        //设置文件的默认保存目录，不设置则保存在系统临时目录下  os
        uploadDir: path.resolve(__dirname, '../static/uploads')
    },
    multipart: true // 支持文件上传
}));


app.use(koaStatic(
    path.resolve(__dirname, '../static')
));



//跨域处理
app.use((ctx) => {
  console.log('path',ctx.path)

    //指定一个接口和返回数据
    var path =ctx.path;
    if(path==='/getdata'){

        console.log('receive req');

        //服务端通过 ctx.headers.origin 获取请求中的origin
        //ctx.set('Access-Control-Allow-Origin', ctx.headers.origin);

        ctx.body=JSON.stringify({
            code:0,
            msg:'success',
            data:[]
        });
    }
})


/**
 * Create HTTP server.
 */
var server = http.createServer(app.callback());
server.listen(port);
console.log('cors demo1 server start ......   ');
