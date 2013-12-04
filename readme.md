## Socky

Download images, scripts and stylesheets through websockets

### Introduction

This is a simple project designed to show how http2 or spdy could be implemented with websockets.
Instead of fetching images with normal http requests, they are fetched through websockets. 
This has several advantages:

* A single tcp connection is used for all data
* The server can push files which haven't been requested yet
* There can be an unlimited number of requests in parallel

### Download/install

Clone this git repo, and run `npm install`

### How to use

Edit the `src/index.html` file, and when you are happy with it, run `node sockify.js`. 
This produces the `dst/index.html` file, which is served by the simple webserver to the client.
Start the webserver with `node server.js` and go to `http://localhost:80`.

You can add other stylesheets, scripts and images to the html page and it will load them all throught websockets. 
You can also send files to the client without it asking for them, anticipating that it will request them 
in the near future

### Why?

I just had a random idea, and wanted to test it. I doubt this implementation is useful.