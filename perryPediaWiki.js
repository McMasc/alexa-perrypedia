var request = require('request');
var cheerio = require('cheerio');
var htmlToText = require('html-to-text');
var util = require('util');


//////////////////////////////////////////////////////////////////////////////////////////
// Alexa Private Helperfunctions
//////////////////////////////////////////////////////////////////////////////////////////

function makeAudiable( text ) {
  text = text.replace(/\(\*\s?(.*)\)/g, ", geboren am $1, "); // Birthday (* ...)
  text = text.replace(/\(PR .*\)/g, ""); 
  return text;
};

function createResponse( title, text, uri ) {
  return { 'say' : makeAudiable(text), 
           'card' : { type: "Standard",
                      title: title,
                      text: text,
                      image: { smallImageUrl: "https://mascgroup.com/blog-media/logo.png"} 
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

// Query real Person basic information, only the first para will be spoken
// Example: Alexa, frage Perry Pedia wer ist {person}?
PerryPediaWiki.prototype.queryRealPersonInfo = function (person, callback) {
    var url = util.format(this._QUERYWIKI, encodeURIComponent(person));
    request( url, function (error, response, body) {
      if (!error && response.statusCode == 200) {

        // Query Basic Information of a 'real' Person
        var $ = cheerio.load(body);  

        var title = htmlToText.fromString( $('h1#firstHeading').find("span").first().html(), {
          ignoreHref: true, wordwrap: null 
        });

        var text = htmlToText.fromString( $('#mw-content-text').find("p").first().html(), {
          ignoreHref: true, wordwrap: null 
        });

        // Success Response
        callback( false, createResponse( title, text, url ) );
      } else {
        // Error Response
        callback( error );
      }
    });  
};

// Query Person appearance
// Example: Alexa, frage Perry Pedia wie schaut {person} aus?
PerryPediaWiki.prototype.queryRealPersonAppearance = function (person, callback) {
    var url = util.format(this._QUERYWIKI, encodeURIComponent(person));
    request( url, function (error, response, body) {
      if (!error && response.statusCode == 200) {

        var $ = cheerio.load(body);  
        var title = htmlToText.fromString( $('h1#firstHeading').find("span").first().html(), {
          ignoreHref: true, wordwrap: null 
        });
        var text = htmlToText.fromString( $('#mw-content-text')
            .find("h2:contains('Erscheinungsbild')").nextAll('p').eq(0).html(), {
          ignoreHref: true, wordwrap: null 
        });

        // Success Response
        callback( false, createResponse( title, text, url ) );
      } else {
        // Error Response
        callback( error );
      }
    });  
};

module.exports = PerryPediaWiki;