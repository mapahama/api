
/*
* Retrieves the text from a wikipedia article.
* @param wordUrl1: the URL of the wiki article
*
*/
async function askForWikiSummary(wordUrl1){
    
  await fetch(wordUrl1)
  .then(response => response.json())
  .then(response =>{
      response = response.query.pages;
      var pageid = Object.keys(response)[0];
      var extract = response[pageid].extract;
  
      if(extract !== undefined){
        console.log(extract);
        
        wikiSummary = extract;
        var  ifMoreInfoNeeded = "";

        if(defaultLang === "de-DE"){
          ifMoreInfoNeeded = "soll ich den Artikel vorlesen?";
        } else {
          ifMoreInfoNeeded = "would you like to read the information for you?";
        }
        
        speech.text = ifMoreInfoNeeded;
        messages_area.append(assistantSpeak(ifMoreInfoNeeded));
        synth.speak(speech);        
      } else {

        if(defaultLang === "de-DE"){
          wikiSummary ="Leider habe ich keinen Artikel zum Thema gefunden";
        } else {
          wikiSummary ="Sorry, I did not find information";
        }

        speech.text = wikiSummary;
        messages_area.append(assistantSpeak(wikiSummary));
        synth.speak(speech);  

        console.log(wikiSummary);
      }
  })
  .catch(error => console.error(error));       
}
