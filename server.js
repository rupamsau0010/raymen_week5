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
      arr = [];
      $(".title-artist em").each((i, el) => {
        const item = $(el).text();
        arr.push(item);
      });
      console.log(arr);
      console.log(artists);

      // Marge the two array and get the common items
      let mailArtists = ""
      for (let i = 0; i < artists.length; i++) {
        if (arr.includes(artists[i])) {
          // console.log(artists[i]);
          mailArtists = mailArtists + String(artists[i]) + " "
        }
      }
      console.log(mailArtists);
      if (mailArtists.length > 0) {
        // Sent a mail
        // Create a grid to send on the mail
        const output = `
        <h3>Your artists are: ${mailArtists}</h3>
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
          from: `"Name of the Artists" <${process.env.email1ID}>`, // sender address
          to: process.env.email2ID, // list of receivers
          subject: "Name of the Artists", // Subject line
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
