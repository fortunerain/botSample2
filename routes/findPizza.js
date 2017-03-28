'use strict';
var rp = require('request-promise');
var url = process.env.PIZZAINFO_LOCAL_URL;

module.exports = (param, session) =>{
    
    return {
        findPizzaOne : () => {
            var options = {
                method: "POST",
                url: url,
                form: { "pizzaName": param }
            };
            
            rp(options)
                .then(function (data) {
                    // session.send(data);
                    console.log("########조회 결과#########");
                    console.log(data);
                    console.log("#########################");
                    // return data;
                    session.send(jsonFormatter(data));
                })
                .catch(function (err) {
                    // session.send("API 서버 오류 발생!!");
                    console.log("API 서버 오류 : "+err);
                    return err;
                });
        }
    };

function jsonFormatter(data){
    var result="";
    data = JSON.parse(data);
    for (var key in data){
        console.log( key + ": " + data[key]);
        //개행안됨.
        result += key + ": " + data[key] +"\r\n";
    }

    return result;
}

};

