var isSpeaking = synth.speaking;
var recognitionStart = false;
/*
* Handling event click on maleBtn.
*/
maleBtn.addEventListener("click", function(e){
  let currentBtn = e.target;
  let previousBtn = e.target.previousElementSibling;
  
  previousBtn.classList.remove("active");
  previousBtn.classList.add("inactive");
  currentBtn.classList.remove("inactive");
  currentBtn.classList.add("active");

  defaultLang = synth.getVoices()[0].lang;
  
  if(defaultLang !== "de-DE"){
    speech.voice = speechSynthesis.getVoices().filter(function(voice){
      return voice.name == 'Google UK English Male';
  })[0];
  } 
});

/*
* Handling event click on femaleBtn.
*/
femaleBtn.addEventListener("click", function(e){
  let currentBtn = e.target;
  let nextBtn = e.target.nextElementSibling;
  
  nextBtn.classList.remove("active");
  nextBtn.classList.add("inactive");
  currentBtn.classList.remove("inactive");
  currentBtn.classList.add("active");

  defaultLang = synth.getVoices()[0].lang;
  
  if(defaultLang !== "de-DE"){
    speech.voice = speechSynthesis.getVoices().filter(function(voice){
      return voice.name == 'Google UK English Female';
  })[0];
  } 
});

/*
* Handling event click on mic button and activating SpeechRecognition.
*/
mic.addEventListener('click', () => {
  defaultLang = synth.getVoices()[0].lang;
  console.log("Default browser language is " + defaultLang);
  
  let appWakeWords ="";

  if(defaultLang === "de-DE"){
    appWakeWords =" Stellen Sie mir eine Frage! Ich kann zusätzlich dazu in Wikipedia und in Google suchen."+
    " Sagen Sie einfach das Schlüsselwort " + "<b><span style='color: rgba(15, 14, 14, 0.782);'>" + "Google" + 
    "</span></b>" + " oder "+ "<b><span style='color: rgba(15, 14, 14, 0.782);'>" +  "Wikipedia" + 
    "</span></b>" + ", gefolgt von der gewünschten Info. Falls Sie nach Papers suchsen, nutzen Sie das Schlüsselwort " + 
     "<b><span style='color: rgba(15, 14, 14, 0.782);'>" + "Paper." + "</span></b>";
  } else {
    appWakeWords =" Ask me anything! I can also search in Wikipedia and Google for you."+
  " Just say the keyword " + "<b><span style='color: rgba(15, 14, 14, 0.782);'>" + "Google" + 
  "</span></b>" + " or "+ "<b><span style='color: rgba(15, 14, 14, 0.782);'>" +  "Wikipedia" + 
  "</span></b>" + ", followed by the info you need. If you are a Smarty," + 
  " use the keyword " + "<b><span style='color: rgba(15, 14, 14, 0.782);'>" + 
  "Paper" + "</span></b>" + " to find scientific articles!";
  }

  synth.cancel;
  mic.classList.add("active");

  //speech = new SpeechSynthesisUtterance("hi");

  console.log("Listening...");
  notchat.style.display = "none"; 
  mic.style.pointerEvents = "none"; 
     
  let result = saluteToDaytime();
  speech.text = result;

  messages_area.append(assistantSpeak(appWakeWords));
  messages_area.append(assistantSpeak(speech.text));
  synth.speak(speech);

  stop = false;    
  
  //setTimeout(function() {
  //  recognition.start();      
  //}, 1500); 
  recognitionStart = true;
});

/*
* Handling event SpeechRecognition end. 
*/
recognition.onend = function() { 

  console.log("In function recognition.onend");
  iteration = 0;

  if(!stop && !stopRecognitionWikiText){
    recognition.start();   
  }
}

/*
* Handling event SpeechRecognition start. 
*/
recognition.onstart = function(){
  
  console.log("In function recognition.onstart");
  mic.style.pointerEvents = "none";
  var counter = 0;
  iteration++;     
}

/*
* Event when users utterance stops. 
*/
recognition.onspeechend = function(){
  
  console.log("In function recognition.onspeechend");
}

/*
* Event in case of error. 
*/
recognition.onerror = function(event) {
  console.log("Error occurred: ", event.error);
}

/*
* Resuming SpeechRecognition when the SpeechSynthesis from the assistant is ended.
*/
speech.addEventListener('end', (event) => {

  console.log("In function speech addEventListener end" + event);
  // start the speech recognition in the app after clicking on mic button
  recognition.removeEventListener('result', handleSpeechRecognition);

  if(recognitionStart){
    recognitionStart = false;
    recognition.start();
  }
  
  setTimeout(function() {
    synth.cancel();

    if(askedWikiInformation){ 
      askForWikiSummary(wordUrl1);
      askedWikiInformation = false; 
    }
    
    isSpeaking = synth.speaking;
    if(!isSpeaking){
      recognition.addEventListener('result', handleSpeechRecognition);   
    }
  }, 1700); 
});


/*
* Removing SpeechRecognition when SpeechSynthesis starts.
*/
speech.addEventListener('start', (event) => {

  console.log("in function speech addEventListener start " + event);
  
  //recognition.removeEventListener('result', handleSpeechRecognition);
  myTimeout = setTimeout(myTimer, 10000);
});

/*
* Recognizing the users utterance and converting it into text in the chat window.
*/
function handleSpeechRecognition(event) {

   console.log("In function handleSpeechRecognition " + event);

   //var transcript = event.results[event.resultIndex][0].transcript;
   isSpeaking = synth.speaking;
  
   if(!isSpeaking){
      var transcript = event.results[event.resultIndex][0].transcript;
     
      if (transcript.trim().length !== 0){
          messages_area.append(userMSg(transcript));
          assistantMsg(transcript);
      } else {
          console.log("! null or interrupted: " + event.resultIndex);   
          event.results[event.resultIndex][0].transcript = ''; 
      
          setTimeout(function() {
          }, 1500); 
      }
   }
}

// Handle beforeunload event to stop the speech synthesis when page is refreshed
window.addEventListener('beforeunload', function() {
  synth.cancel();
  synth = null;
  speech = null;
});
