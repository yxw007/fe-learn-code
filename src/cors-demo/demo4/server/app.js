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

app.use(koaBody());

app.use(koaStatic(
    path.resolve(__dirname, '../static')
));


//跨域处理
app.use((ctx) => {
    //指定一个接口和返回数据
    var path =ctx.path;
    if(path==='/getdata'){

        console.log('receive req');

        if (canRequest(ctx.headers.origin)){
        //服务端通过 ctx.headers.origin 获取请求中的origin
            ctx.set('Access-Control-Allow-Origin', ctx.headers.origin);
        }
        
        ctx.set('Access-Control-Allow-Methods', 'PUT');

        ctx.set('Access-Control-Max-Age', 3600);

        ctx.body=JSON.stringify({
            code:0,
            msg:'success',
            data:[]
        });
    }else{
        ctx.body='welcome';
    }
});


/**
 * Create HTTP server.
 */
var server = http.createServer(app.callback());
server.listen(port);
console.log('cors demo4 server start ......   ');
