var SysLogger = require('ain2');
var console = new SysLogger({tag: 's3rp', facility: 'local2'});

var sys     = require('sys'),
    http    = require('http'),
    port    = 8000,
    upstreamHost = process.argv[2];

var main = function() {
    http.createServer(handle_request).listen(port);
    console.log("101\tSTART\t-\t-\treverse proxy to " + upstreamHost + " http://localhost:" + port );
};

var handle_request = function (client_request, client_response) {
    var localhost = client_request.headers.host;
    client_request.headers.host = upstreamHost;
    
    var options = {
	host: upstreamHost,
	port: 80,
	method: client_request.method,
        path: client_request.url,
        headers: client_request.headers
    };
    var upstream_request = http.request(options);


    
    client_request.addListener("data", function(chunk) {
        upstream_request.write(chunk)
    });
    client_request.addListener("end", function() {
        upstream_request.end();
    });

    upstream_request.addListener("response", function (upstream_response) {
        proxy_pass_reverse(upstream_response, localhost);
        client_response.writeHead(
            upstream_response.statusCode,
            upstream_response.headers
        );
        var size = 0;
        upstream_response.addListener("data", function(chunk) {
            client_response.write(chunk);
            size += chunk.length;
        });
        upstream_response.addListener("end", function() {
	    console.log(upstream_response.statusCode +"\t"+ client_request.method + "\t" + client_request.url + "\t" + size);
            client_response.end();
        });
    });
};

// Last-Modifiedヘッダを抜き出して、それをx-last-modifiedとしてみた
var proxy_pass_reverse = function(upstream_response, localhost) {
    var xlm = upstream_response.headers["x-amz-meta-mtime"];
    if (xlm) {
	upstream_response.headers['last-modified'] = xlm;
	upstream_response.headers['server'] = "s3rp";
    }
};

main();
