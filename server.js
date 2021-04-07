// Import dependencies
require("dotenv").config()
const request = require("request")
const cheerio = require("cheerio")
const readline = require('readline')

// Readline setup
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

r1.question(`What's the name of artists: `, name => {
    // Getting the names of the Artists
    const artists = name.split(" ")
    r1.close()

    // Get the URL and get data from site
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
            console.log(arr);
            console.log(artists);

            // Marge the two array and get the common items
            const mailArtists = []
            for(let i = 0; i < artists.length; i++) {
                if(arr.includes(artists[i])) {
                    // console.log(artists[i]);
                    mailArtists.push(artists[i])
                }
            }
            
        }
    })
})
