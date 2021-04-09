// Import dependencies
require("dotenv").config();
const request = require("request");
const cheerio = require("cheerio");
const readline = require("readline");
const nodemailer = require("nodemailer");

// Readline setup
const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

r1.question(`What's the name of artists: `, (name) => {
  // Getting the names of the Artists
  const artists = name.split(" ");
  r1.close();

  // Get the URL and get data from site
  // get url
  const URL = process.env.URL;

  request(URL, (err, response, html) => {
    if (!err && response.statusCode == 200) {
      const $ = cheerio.load(html);
      myDist = {};
      $(".title-artist").each((i, el) => {
        const artist = $(el).find("em").text();
        const song = $(el).find("cite").text();
        myDist[String(artist)] = String(song);
      });
      // console.log(Object.keys(myDist));
      // console.log(artists);
      artistArr = Object.keys(myDist);

      let mailArtists = "";
      let mailBody = "";
      let mailArtistsArr = [];
      for (let i = 0; i < artists.length; i++) {
        if (artistArr.includes(artists[i])) {
          // console.log(artists[i]);
          mailArtists = mailArtists + String(artists[i]) + ", ";
          mailArtistsArr.push(String(artists[i]));
          mailBody += "<li>" + "<b>" + String(artists[i]) + "</b>" + ": " + "<i>" + String(myDist[artists[i]]) + "</i>" + "</li>";
        }
      }
      // console.log(mailArtists);
      // console.log(mailArtistsArr);
      // console.log(mailBody);
      mailArtists = mailArtists.slice(0, -2)

      if (mailArtistsArr.length > 0) {
        // Sent a mail
        // Create a grid to send on the mail
        const output = `
        <ul>${mailBody},</ul>
        `;
      
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: process.env.email1ID, // generated ethereal user
            pass: process.env.email1Pass, // generated ethereal password
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
      
        let mailOptions = {
          from: `<${process.env.email1ID}>`, // sender address
          to: process.env.email2ID, // list of receivers
          subject: `Your artist(s) are: ${mailArtists}`, // Subject line
          text: "Name of the Artists", // plain text body
          html: output, // html body
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            res.status(500).send(error);
          } else {
            console.log("Message sent: %s", info.messageId);
          }
        });
      } else {
        console.log("No artists found. Mail will not be sent");
      }
    }
  });
});
