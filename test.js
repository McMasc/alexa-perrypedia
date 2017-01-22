var PerryPediaWiki = require("./perryPediaWiki");
var perryPedia = new PerryPediaWiki();

function debug(error, wikiResponse) {
      console.log("\n" + "-".repeat(140));
      if (!error) {
        console.log(wikiResponse.say);
        console.log(wikiResponse.card);
      } else {
        console.log("Entschuldigung, das weiß ich jetzt gerade nicht. Probiere es bitte später nocheinmal.");
      }
}

var testPersons = ['Perry Rhodan', 'Bully', 'Icho Tolot', 'Ronald Tekener', 'Farye Sepheroa'];

for (var index = 0; index < testPersons.length; index++) {
    person = testPersons[index];
    perryPedia.queryRealPersonInfo( person, debug ); 
    perryPedia.queryRealPersonAppearance( person, debug ); 
}