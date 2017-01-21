var request = require('request');
var cheerio = require('cheerio');
var htmlToText = require('html-to-text');
var util = require('util');

// Constructor
function PerryPediaWiki() {
  this.QUERYWIKI = 'http://www.perrypedia.proc.org/wiki/%s';
}

// Query Real Person Basic Info
// Example: Alexa, frage Großrechner Nathan wer ist {person}
PerryPediaWiki.prototype.queryRealPersonInfo = function (person, callback) {
    var url = util.format(this.QUERYWIKI, person);
    request( url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);  
        var text = htmlToText.fromString( $('#mw-content-text').find("p").first().html(), {
          ignoreHref: true, wordwrap: null 
        });
        // Send Back
        callback(text);
      }
    });  
};

PerryPediaWiki.prototype.queryRealPersonAppearance = function (person, callback) {
    var url = util.format(this.QUERYWIKI, person);
    request( url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);  
        var text = htmlToText.fromString( $('#mw-content-text').find("h2:contains('Erscheinungsbild')").nextAll('p').eq(0).html(), {
          ignoreHref: true, wordwrap: null 
        });
        // Send Back
        callback(text);
      }
    });  
};

module.exports = PerryPediaWiki;


var test = new PerryPediaWiki();
test.queryRealPersonAppearance('Farye Sepheroa', function(response){console.log(response);});