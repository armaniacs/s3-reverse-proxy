s3-reverse-proxy
================

S3 Reverse proxy which overrides last-modify by x-amz-meta-mtime.

* It works with not only S3 but also any http server which run on TCP/80.
* s3-reverse-proxy.js listen TCP/8000.
* All logs are sent w/ syslog. Facility = local2.


Usage
===============

$ node s3-reverse-proxy.js target-hostname.

Examples
--------------

* example 1
  $ node s3-reverse-proxy.js hogehoge.s3-website-ap-northeast-1.amazonaws.com
  $ curl localhost:8000/index.txt -I
  
* example 2
  $ node s3-reverse-proxy.js hogehoge.s3-website-us-west-2.amazonaws.com
  $ curl -I localhost:8000/fuga.jpg
