var restify = require('restify');
var builder = require('botbuilder');
//.env 파일에 환경설정함. process.env.NODE_ENV 등등
require('dotenv').config()
 
//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.use(restify.CORS()); 
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
}); 
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
console.log(process.env.MICROSOFT_APP_ID);
console.log(process.env.MICROSOFT_APP_PASSWORD);

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
    session.send("Hello World");
});