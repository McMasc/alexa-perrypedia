"use strict";

let request = require('request');
let cheerio = require('cheerio');
let htmlToText = require('html-to-text');
let util = require('util');

// Constructor
function PerryPediaWiki() {
  this.WIKIENDPOINT = 'http://www.perrypedia.proc.org/wiki/%s';
}

// Query Real Person
PerryPediaWiki.prototype.queryRealPerson = function (person, callback) {
    var url = util.format(this.WIKIENDPOINT, person);
    request( url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let $ = cheerio.load(body);
        
        var text = htmlToText.fromString( $('#mw-content-text').find("p").first().html(), {
          ignoreHref: true, wordwrap: null 
        });

        // Send Back
        callback(text);
      }
    });  
}

module.exports = PerryPediaWiki;

// Test
var test = new PerryPediaWiki();
test.queryRealPerson( "Perry Rhodan", function(response) {console.log("\nPerry Rhodan: "); console.log(response); } );
test.queryRealPerson( "Reginald Bull", function(response) {console.log("\nReginald Bull: "); console.log(response); } );
test.queryRealPerson( "Bully", function(response) {console.log("\nBully: "); console.log(response); } );
test.queryRealPerson( "Gucky", function(response) {console.log("\nGucky: "); console.log(response); } );
test.queryRealPerson( "Atlan", function(response) {console.log("\nAtlan: "); console.log(response); } );