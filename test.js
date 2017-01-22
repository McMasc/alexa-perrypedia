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

perryPedia.queryRealPersonInfo( 'Perry Rhodan', debug ); 
perryPedia.queryRealPersonInfo( 'Bully', debug ); 
perryPedia.queryRealPersonInfo( 'Icho Tolot', debug ); 
perryPedia.queryRealPersonInfo( 'Ronald Tekener', debug ); 
perryPedia.queryRealPersonInfo( 'Farye Sepheroa', debug ); 