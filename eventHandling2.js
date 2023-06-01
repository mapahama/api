
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

  speech.voice = speechSynthesis.getVoices().filter(function(voice){
      return voice.name == 'Google UK English Male';
  })[0];
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

  speech.voice = speechSynthesis.getVoices().filter(function(voice){
      return voice.name == 'Google UK English Female';
  })[0];
});

/*
* Handling event click on mic button and activating SpeechRecognition.
*/
mic.addEventListener('click', () => {

  let appWakeWords =" Ask me anything! I can also search in Wikipedia and Google for you."+
  " Just say the keyword " + "<b><span style='color: rgba(15, 14, 14, 0.782);'>" + "Google" + 
  "</span></b>" + " or "+ "<b><span style='color: rgba(15, 14, 14, 0.782);'>" +  "Wikipedia" + 
  "</span></b>" + ", followed by the info you need. If you are a Smartie," + 
  " use the keyword " + "<b><span style='color: rgba(15, 14, 14, 0.782);'>" + 
  "Paper" + "</span></b>" + " to find scientific articles!";

  synth.cancel

  //speech = new SpeechSynthesisUtterance("hi");

  console.log("Listening...");
  notchat.style.display = "none"; 
  mic.style.pointerEvents = "none"; 
     
  let result = saluteToDaytime();
  speech.text = result;

  messages_area.append(assistantSpeak(appWakeWords));
  messages_area.append(assistantSpeak(speech.text));
  synth.speak(speech);
  
  var isSpeaking = synth.speaking;
  var counter = 0;
  while(isSpeaking){
    if(counter > 30000){
      break;
    }
    counter++;
    console.log("counter: " + counter);
    isSpeaking = synth.speaking;
  }
  counter = 0;
  //start recognition
  setTimeout(function() {
      recognition.start(); 
  }, 0);

  stop = false;    
  
});

/*
* Handling event SpeechRecognition end. 
*/
recognition.onend = function() { 

  console.log("ended...");
  iteration = 0;

  if(!stop){
    recognition.start();
  }
}

/*
* Handling event SpeechRecognition start. 
*/
recognition.onstart = function(){
  mic.style.pointerEvents = "none";
  var counter = 0
  iteration++;     
}

/*
* Event when users utterance stops. 
*/
recognition.onspeechend = function(){
  console.log("No Activity...");
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

  setTimeout(function() {
    synth.cancel();
    console.log("on end speech event" + event);


    if(askedWikiInformation){ 
      askForWikiSummary(wordUrl1);
      askedWikiInformation = false; 
    }

    recognition.addEventListener('result', handleSpeechRecognition);          
  }, 2000); 

});


/*
* Removing SpeechRecognition when SpeechSynthesis starts.
*/
speech.addEventListener('start', (event) => {

  console.log("on start speech event" + event);
  myTimeout = setTimeout(myTimer, 10000);
  recognition.removeEventListener('result', handleSpeechRecognition);
});

/*
* Recognizing the users utterance and converting it into text in the chat window.
*/
function handleSpeechRecognition(event) {

  console.log("recognition event: " + event);
  var isSpeaking = synth.speaking;

  //check if the assistant is speaking
  if (!isSpeaking){

      console.log(event);
      console.log("result received");
      var transcript = event.results[event.resultIndex][0].transcript;

      if (transcript.trim().length !== 0){
          messages_area.append(userMSg(transcript));
          assistantMsg(transcript);
      }

  } else {
      console.log("! iteration2: " + event.resultIndex)       
      event.results[event.resultIndex][0].transcript = '';
  }
}

// Handle beforeunload event to stop the speech synthesis when page is refreshed
window.addEventListener('beforeunload', function() {
  synth.cancel();
  synth = null;
  speech = null;
});
