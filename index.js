const server = require('http').createServer;
const httpRequest = require('http').get;
const httpsRequest = require('https').get;
const fs = require('fs');
const url = require('url');
const {isValidUrl, metas} = require("./handler");

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
        if(!isValidUrl(queryUrl)){
            response.writeHead(200, {
                "Content-Type" : "application/json"
            });
            response.end(JSON.stringify({success: false, message: "Url malformed"}));
            return;
        }
        let request;
        queryUrl.startsWith("http://") ? request = httpRequest : request = httpsRequest;
        const fetch = request(queryUrl, (res)=>{
            if(res.statusCode !== 200){
                response.writeHead(200, {
                    "Content-Type" : "application/json"
                });
                response.end(JSON.stringify({success: false, message: "Request Failed!!"}));
                res.resume();
                return;
            }
            let chunks = [];
            res.on("readable", ()=>{
                let chunk;
                while((null !== (chunk = res.read()))){
                    chunks.push(chunk);
                }
            });
            res.on("end", ()=>{
                let body = Buffer.concat(chunks);
                let data = metas(body.toString());
                response.writeHead(200, {
                    "Content-Type" : "application/json"
                });
                response.end(JSON.stringify({success:true, data:data}));

            }).on("error", (e)=>console.log(e.code));
        })
        .on("error", (e)=>{
            response.writeHead(200, {
                "Content-Type" : "application/json"
            });
            response.end(JSON.stringify({success:false, message:"Request Failed!!"}));
        })
        fetch.end();
    }
}).listen(8000, ()=>console.log("App Running on 8000"));