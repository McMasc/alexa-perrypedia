var Alexa = require("alexa-app");
var PerryPediaWiki = require("./perryPediaWiki");

var perryPedia = new PerryPediaWiki();
var alexaApp = new Alexa.app();

// Alexa, starte Grossrechner Nathan ...
alexaApp.launch( function(request, response) {
  response.say( "Willkommen Terraner! Ich bin NATHAN der lunare Großrechner der Menschheit. Stelle mir eine Frage. z.B. Alexa, frage Großrechner Nathan wer ist Perry Rhodan?").send();
  // because this is an async handler
  return false;
});

alexaApp.intent( "personQueryIntent", {
    "slots": {
      "person": "PERSON"
    },
    "utterances": [
      "Wer ist {-|person}."
    ]
  }, function(request, response) {
    var person = request.slot("person");
    perryPedia.queryRealPersonInfo( person, function(wikiResponse) {response.say(wikiResponse).send();} );
    return false;
  }
);

// connect to lambda
exports.handler = alexaApp.lambda();

