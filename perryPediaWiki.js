var request = require('request');
var cheerio = require('cheerio');
var htmlToText = require('html-to-text');
var util = require('util');


//////////////////////////////////////////////////////////////////////////////////////////
// Alexa Private Helperfunctions
//////////////////////////////////////////////////////////////////////////////////////////

function makeAudiable( responseTextLines ) {
  var text = '';
  for (var index = 0; index < responseTextLines.length; index++) {
    text += '<p>' + responseTextLines[index] + '</p>';
  }
  text = text.replace(/\(\*\s?(.*)\)/g, ", geboren am $1, "); // Birthday (* ...)
  text = text.replace(/\(PR .*\)/g, ""); 
  return text;
};

function createResponse( title, responseTextLines, uri ) {
  return { 'say' : makeAudiable(responseTextLines), 
           'card' : { type: "Standard",
                      title: title,
                      text: responseTextLines.join('\n\n') 
                      , image: { smallImageUrl: "https://mascgroup.com/blog-media/image.php", 
                                 largeImageUrl: "https://mascgroup.com/blog-media/image.php"  }
                    },
           'URI' : uri };
};

//////////////////////////////////////////////////////////////////////////////////////////
// Alexa Module Functions
//////////////////////////////////////////////////////////////////////////////////////////

// Constructor
function PerryPediaWiki() {
  // Perry Pedia has no https :( ...
  this._QUERYWIKI = 'http://www.perrypedia.proc.org/wiki/%s';
}

// Query 'real' (not artificial) person information, only the first para will be spoken
// Example: Alexa, frage Perry Pedia wer ist {person}?
PerryPediaWiki.prototype.queryRealPersonInfo = function (person, callback) {
    var url = util.format(this._QUERYWIKI, encodeURIComponent(person));
    request( url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // Query Basic Information of a 'real' Person
        var $ = cheerio.load(body);  

        var title = htmlToText.fromString( $('h1#firstHeading')
                              .find("span").first().html(), {ignoreHref: true, wordwrap: null});

        var responseTextLines = []; 
        responseTextLines.push( htmlToText.fromString( $('#mw-content-text')
                           .find("p").first().html(), {ignoreHref: true, wordwrap: null}));

        responseTextLines.push( htmlToText.fromString( $('#mw-content-text')
                           .find("h2:contains('Erscheinungsbild')")
                           .nextAll('p').eq(0).html(), {ignoreHref: true, wordwrap: null }));

        responseTextLines.push( $('#mw-content-text').find("div:contains('© Pabel-Moewig Verlag KG')").find('img').first().attr('src'));

        if (responseTextLines.length == 0) {
          callback( new Error('No Data found.\n' + url + '\n' + body) );
        } else {
          // Success Response
          callback( false, createResponse( title, responseTextLines, url ) );
        }
      } else {
        // Error Response
        callback( new Error('HTTP Error Response: ' + response.statusCode)  );
      }
    });  
};

// Query issue information
// Example: Alexa, frage Perry Pedia was gescha in Folge nummer {2000}
PerryPediaWiki.prototype.queryIssueInfo = function (issueNumber, callback) {
    var url = util.format(this._QUERYWIKI, encodeURIComponent("Quelle:PR"+issueNumber));
    request( url, function (error, response, body) {
      if (!error && response.statusCode == 200) {

        var $ = cheerio.load(body);  

        var title = htmlToText.fromString( $('h1#firstHeading').find("span").first().html(), {
          ignoreHref: true, wordwrap: null 
        });

        var responseTextLines = []; 

        responseTextLines.push( issueNumber );
        responseTextLines.push( htmlToText.fromString( $("td:contains('Titel') +").html(), {ignoreHref: true, wordwrap: null}));
        responseTextLines.push( htmlToText.fromString( $("td:contains('Untertitel') +").html(), {ignoreHref: true, wordwrap: null}));
        responseTextLines.push( htmlToText.fromString( $("td:contains('Zyklus') +").html(), {ignoreHref: true, wordwrap: null}));
        responseTextLines.push( htmlToText.fromString( $("td:contains('Hauptpersonen') +").html(), {ignoreHref: true, wordwrap: null}));

        if (responseTextLines.length == 0) {
          callback( new Error('No Data found.\n' + url + '\n' + body) );
        } else {
          // Success Response
          callback( false, createResponse( title, responseTextLines, url ) );
        }
      } else {
        // Error Response
        callback( new Error('HTTP Error Response: ' + response.statusCode ) );
      }
    });  
};

module.exports = PerryPediaWiki;