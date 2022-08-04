exports.isValidUrl = function(string) {
    var res = string.match(/^(https?:\/\/)((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/g);
    return (res !== null)
};

exports.metas = function(data){
    let regex = /(<meta)(.+?)(>)/gs;
    let allSet = ""
    let obj = {};
    for (let match of data.matchAll(regex)){
    let str = match[0];
    if(allSet.length === 4) break;
    if(/('|")og:image('|")/.test(str)){
        obj.image = str.match(/content=.+?('|")/)[0].split("=")[1].replace(/['"]+/g, '');
        allSet += "-";
        continue;
    }
    if(/('|")og:url('|")/.test(str)){
        obj.url = str.match(/content=.+?('|")/)[0].split("=")[1].replace(/['"]+/g, '');
        allSet += "-";
        continue;
    }
    if(/('|")og:site_name('|")/.test(str)){
        obj.siteName = str.match(/content=.+?('|")/)[0].split("=")[1].replace(/['"]+/g, '');
        allSet += "-";
        continue;
    }
    if(/('|")og:description('|")/.test(str)){
        obj.description = str.match(/content=.+?('|")/)[0].split("=")[1].replace(/['"]+/g, '');
        allSet += "-";
        continue;
    }
    }
    return obj;
}