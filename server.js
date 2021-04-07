// Import dependencies
require("dotenv").config()
const request = require("request")
const cheerio = require("cheerio")

// get url
const URL = process.env.URL

request(URL, (err, response, html) => {
    if(!err && response.statusCode == 200) {
        const $ = cheerio.load(html)
        arr = []
        $('.title-artist em').each((i, el) => {
            const item = $(el).text()
            arr.push(item)  
        })
        // console.log(arr);
    }
    console.log(process.argv);
})