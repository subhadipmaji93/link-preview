const httpRequest = require('http').get;
const httpsRequest = require('https').get;
const parse = require('url').parse;

exports.isValidUrl = function(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)/g);
    return (res !== null)
};

function metas(data){
    let regex = /(<meta)(.+?)(>)/gs;
    let allSet = ""
    let obj = {};
    try{
        for (let match of data.matchAll(regex)){
            let str = match[0];
            // console.log('meta value:' + str);
            if(allSet.length === 4) break;
            if(/('|")og:image('|")/.test(str)){
                let match = str.match(/content=.+?('|")/);
                if(match === null) continue;
                obj.image = match[0].split("=")[1].replace(/['"]+/g, '');
                allSet += "-";
                continue;
            }
            if(/('|")og:url('|")/.test(str)){
                let match = str.match(/content=.+?('|")/);
                if(match === null) continue;
                obj.url = match[0].split("=")[1].replace(/['"]+/g, '');
                allSet += "-";
                continue;
            }
            if(/('|")og:site_name('|")/.test(str)){
                let match = str.match(/content=.+?('|")/);
                if(match === null) continue;
                obj.siteName = match[0].split("=")[1].replace(/['"]+/g, '');
                allSet += "-";
                continue;
            }
            if(/('|")og:description('|")/.test(str)){
                let match = str.match(/content=.+?('|")/);
                if(match === null) continue;
                obj.description = match[0].split("=")[1].replace(/['"]+/g, '');
                allSet += "-";
                continue;
            }
            }
    } catch(e){
        console.log(e.code);
    }
    // console.log('OBJ:' + obj);
    return Object.keys(obj).length !== 0? obj:null;
}

exports.fetch = function fetch(url, cb){
    let urlObj = parse(url, true);
    let queryUrl = urlObj.href;
    let request;
    urlObj.protocol === "http:" ? request = httpRequest : request = httpsRequest;
    if(urlObj.protocol === null) queryUrl = `https://${queryUrl}`;
    let options = {headers:{ 'User-Agent': 'Mozilla/5.0'}};
    request(queryUrl, options, (res)=>{
        if(!!(res.statusCode >= 300 && res.statusCode < 400)){
            res.resume();
            return fetch(res.headers.location, cb);
        }
        if(res.statusCode !== 200){
            cb({message: "Request Failed!!"}, null);
            res.resume();
            return;
        }
        let body = [];
        res.on("readable", ()=>{
            let chunk;
            while((null !== (chunk = res.read()))){
                body.push(chunk);
            }
        });
        res.on("end", ()=>{
            let data = metas(Buffer.concat(body).toString());
            if(data === null){
                cb({message: "No information!!"}, null);
                return;
            }
            cb(null, {data:data});
        }).on("error", (e)=>console.log(e.code));
    })
    .on("error", ()=>{
        cb({message:"Request Failed!!"}, null);
    })
    .end();
}
