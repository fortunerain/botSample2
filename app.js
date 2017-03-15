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
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

// bot.dialog('/', function (session) {
//     session.send("Hello World");
// });

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = "https://"+luisAPIHostName+"/luis/v2.0/apps/"+luisAppId+"?subscription-key="+luisAPIKey+"&verbose=true&q=";
// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/
.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
})
.matches('hello',(session) => {
    session.send('hi!!');
})
.matches('goodbye',(session) => {
    session.send('goodbye!!');
});
//testsdfa

bot.dialog('/', intents);  