
const fs = require('fs')
const text = fs.readFileSync(".\\data\\json\\comic.json","utf8")
const obj = JSON.parse(text);
// console.log(obj);
console.log(obj[0]["tag"]);