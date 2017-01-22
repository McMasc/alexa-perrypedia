var Alexa = require("alexa-app");
var PerryPediaWiki = require("./perryPediaWiki");

var perryPedia = new PerryPediaWiki();
var alexaApp = new Alexa.app();

var appName = "Perry Pedia";

alexaApp.pre = function(request, response, type) {
  // if (request.applicationId != "amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe") {
  //   response.fail("Invalid applicationId");
  // }
};

// Alexa, starte Grossrechner Nathan ...
alexaApp.launch( function(request, response) {
  response.say( "<p>Willkommen Terraner!</p> \
                <p>Ich bin verbunden mit NATHAN dem lunaren Großrechner der Menschheit.</p> \
                <p>Stelle mir eine Frage. z.B. Alexa, frage " + appName + " wer ist Perry Rhodan?</p>").send();
  return false;
});

alexaApp.error = function(exception, request, response) {
  response.say("Entschuldigung, das weiß ich jetzt gerade nicht.");
};

//////////////////////////////////////////////////////////////////////////////////////////
// Alexa  Intents
//////////////////////////////////////////////////////////////////////////////////////////

alexaApp.intent( "personInfoIntent", {
    "slots": {
      "person": "REAL_PERSON"
    },
    "utterances": [
      "Wer ist {-|person}"
    ]
  }, function(request, response) {
    var person = request.slot("person");
    perryPedia.queryRealPersonInfo( person, function(error, wikiResponse) {
      if (!error) {
        response.say(wikiResponse.say);
        response.card(wikiResponse.card);
        response.send();
      } else {
        response.fail("Entschuldigung, das weiß ich jetzt gerade nicht.");
      }
    } );
    return false;
  }
);

alexaApp.intent( "personAppearanceIntent", {
    "slots": {
      "person": "REAL_PERSON"
    },
    "utterances": [
      "Wie schaut {-|REAL_PERSON} aus"
    ]
  }, function(request, response) {
    var person = request.slot("person");
    perryPedia.queryRealPersonAppearance( person, function(error, wikiResponse) {
      if (!error) {
        response.say(wikiResponse.say);
        response.card(wikiResponse.card);
        response.send();
      } else {
        response.fail("Entschuldigung, das weiß ich jetzt gerade nicht.");
      }
    });
    return false;
  }
);

// connect to lambda
exports.handler = alexaApp.lambda();

console.log(alexaApp.schema());