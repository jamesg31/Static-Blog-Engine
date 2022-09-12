const express = require('express');
const SMTPServer = require("smtp-server").SMTPServer;
const parser = require("mailparser").simpleParser

const app = express();
const port = 3001;

var githubRouter = require('./routes/github');
app.use('/github', githubRouter);

const server = new SMTPServer({
    onData(stream, session, callback) {
      parser(stream, {}, (err, parsed) => {
        if (err)
          console.log("Error:" , err)
        
        console.log(parsed)
        stream.on("end", callback)
      })
      
    },
    disabledCommands: ['AUTH']
  });  

server.listen(25, "localhost");

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});

module.exports = app;