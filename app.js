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

// var pizzaNameEntity=null;
// var quantityEntity=null;
// var sizeEntity=null;
// var statusCode = {
    
// }


// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';
const LuisModelUrl = "https://"+luisAPIHostName+"/luis/v2.0/apps/"+luisAppId+"?subscription-key="+luisAPIKey+"&verbose=true&q=";
// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })


.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
})
//인사
.matches('hello',(session) => {
    session.send('맛있는 피자는 작은 차이로부터! 피자헛 챗봇입니다. 주문하시겠습니까? 예) 콤비네이션 피자 라지사이즈 1개');
})
//주문
.matches('getOrder', [
    function(session, args, next) {

        var pizzaNameEntity = builder.EntityRecognizer.findEntity(args.entities, 'pizza');
        var sizeEntity = builder.EntityRecognizer.findEntity(args.entities, 'size');
        var quantityEntity = builder.EntityRecognizer.findEntity(args.entities, 'quantity');

        var order = session.dialogData.order = {
          pizzaName: pizzaNameEntity ? pizzaNameEntity.entity : null,
          size: sizeEntity ? sizeEntity.entity : null,
          quantity : quantityEntity ? quantityEntity.entity : null
        };
        console.log("order : "+order.pizzaName+","+order.size+","+order.quantity);


        if (!order.pizzaName) {
            builder.Prompts.text(session, '어떤 피자를 주문할까요?');
        } else {
            next();
        }
        // if (pizzaNameEntity && quantityEntity && sizeEntity) {
        //     var order = {
        //         pizzaName: pizzaNameEntity.entity,
        //         size: sizeEntity.entity,
        //         quantity: quantityEntity.entity
        //     };
        //     next({ response: order });
        // }else{
        //    session.send('[피자명] [사이즈] [개수] 형식으로 주문해주세요. 예) 콤비네이션 피자 라지사이즈 1개');
        // }

    },
    function(session, results, next) {
        var order = session.dialogData.order;
        if (results.response) {
            order.pizzaName = results.response;
        }       

        if (order.pizzaName && !order.size) {
            builder.Prompts.text(session, '사이즈는 어떤걸로 할까요?');
        } else {
            next();
        }
    },
    function(session, results, next) {
        var order = session.dialogData.order;
        if (results.response) {
            order.size = results.response;
        }

        if (order.pizzaName && order.size && !order.quantity) {
            builder.Prompts.text(session, '피자는 몇개 주문할까요?');
        } else {
            next();
        }
    },
    function(session, results, next) {
        var order = session.dialogData.order;
        if (results.response) {
            order.quantity = results.response;
        }
        session.send('**주문 내역 입니다.');

        console.log(order);


        if(order.pizzaName && order.size && order.quantity) {
            var resultHtml = '**피자명: ' + order.pizzaName + ', \n사이즈: ' + order.size + ', \n수량:' + order.quantity;
            session.send(resultHtml);
            // builder.Prompts.text(session, '**주문을 확인해주세요. 맞습니까?');  
            session.send('**주문을 확인해주세요. 맞습니까?');
        }else{
            session.send("오류발생. 처음부터 주문 해주세요.");
        }
    }
    // ,
    // //주문 완료
    // function(session, results, next) {

    //     var test = {};
    //     test = results.response;

    //     console.log("test : "+test)
    //     var match;
    //     var entity = builder.EntityRecognizer.findEntity(test, 'confirm');
    //     if (entity) {
    //         match = builder.EntityRecognizer.findBestMatch(tasks, entity.entity);
    //     }
    //     console.log("results.response : "+results.response+" entity : "+entity+" match : "+match);


    // }
])
//주문 종료
.matches('confirm',(session) => {
    session.send('주문 되었습니다.!!');
})
//주문 종료
.matches('goodbye',(session) => {
    session.send('goodbye!!');
});


bot.dialog('/', intents);  