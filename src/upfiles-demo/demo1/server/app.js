var http = require('http');
var path = require('path');
var fs = require('fs');
var koaStatic = require('koa-static');
var koaBody = require('koa-body');
var Koa = require('koa');

var app = new Koa();
var port = process.env.PORT || '8100';

var uploadHost = `http://localhost:${port}/uploads/`;

app.use(koaBody({
	formidable: {
		//设置文件的默认保存目录，不设置则保存在系统临时目录下  os
		uploadDir: path.resolve(__dirname, '../static/uploads')
	},
	// 支持文件上传
	multipart: true
}));

//开启静态文件访问
app.use(koaStatic(
	path.resolve(__dirname, '../static')
));

//二次处理文件，修改名称
app.use((ctx) => {
	var file = ctx.request.files ? ctx.request.files.f1 : null; //获取文件对象
	if (file) {
		var path = file.path.replace(/\\/g, '/');
		var fname = file.name; //原文件名称
		var nextPath = '';
		if (file.size > 0 && path) {
			//得到扩展名
			var extArr = fname.split('.');
			var ext = extArr[extArr.length - 1];
			nextPath = path + '.' + ext;
			//重命名文件
			fs.renameSync(path, nextPath);
		}

		console.log("path:", path);
		console.log("fileName:", fname);

		//以 json 形式输出上传文件地址
		ctx.body = `{
        "fileUrl":"${uploadHost}${nextPath.slice(nextPath.lastIndexOf('/') + 1)}"
    }`;
	} else {
		ctx.body = 'null';
	}
});

/**
 * http server
 */
var server = http.createServer(app.callback());
server.listen(port, () => {
	console.log(`demo1 server start success, port:${port}`);
});
