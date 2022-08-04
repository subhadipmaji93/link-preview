const server = require('http').createServer;
const fs = require('fs');
const url = require('url');
const {fetch, isValidUrl} = require("./handler");

server((request, response)=>{
    let urlObj = url.parse(request.url, true);
    if(urlObj.pathname === "/"){
        fs.readFile("index.html", (err, data)=>{
            if(err){
                response.writeHead(500);
                response.end("Something Went Wrong");
            }
            response.writeHead(200, {
                "Content-Type" : "text/html"
            });
            response.end(data);
        });
    }
    if(urlObj.pathname === "/fetch"){
        let queryUrl = urlObj.query.url;
        // console.log('url:' + queryUrl);
        if(!isValidUrl(queryUrl)){
            response.writeHead(200, {
                "Content-Type" : "application/json"
            });
            response.end(JSON.stringify({success: false, message: "Url Invalid OR Unable to fetch!!"}));
            return;
        }
        fetch(queryUrl, (err, res)=>{
            if(err){
                response.writeHead(200, {
                    "Content-Type" : "application/json"
                });
                response.end(JSON.stringify({success: false, message: err.message}));
                return;
            }
            response.writeHead(200, {
                "Content-Type" : "application/json"
            });
            response.end(JSON.stringify({success: true, data:res.data}));
        });
    }
}).listen(8000, ()=>console.log("App Running on 8000"));