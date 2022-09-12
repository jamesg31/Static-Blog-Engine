const express = require('express');
const SMTPServer = require("smtp-server").SMTPServer;
const parser = require("mailparser").simpleParser
const fs = require('fs');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
const port = 3001;

var githubRouter = require('./routes/github');
app.use('/github', githubRouter);

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
});

const server = new SMTPServer({
    onData(stream, session, callback) {
      parser(stream, {}, (err, parsed) => {
        if (err) throw err;

        console.log(parsed)
        fs.appendFile('index.html', parsed.textAsHtml, (err) => {
            if (err) throw err;
            // Read content from the file
            const fileContent = fs.readFileSync('index.html');
        
            // Setting up S3 upload parameters
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: 'index.html', // File name you want to save as in S3
                Body: fileContent,
                ContentType: 'text/html'
            };
        
            // Uploading files to the bucket
            s3.upload(params, (err, data) => {
                if (err) throw err;
                console.log(`File uploaded successfully. ${data.Location}`);
            });
        })
        stream.on("end", callback)
      })
      
    },
    disabledCommands: ['AUTH']
  });  

server.listen(25);

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});

module.exports = app;