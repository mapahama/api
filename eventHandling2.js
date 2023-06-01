
var assistantIsSpeaking = false;
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
  
  console.log("In function mic addEventListener click  Test1");
  
  let appWakeWords =" Ask me anything! I can also search in Wikipedia and Google for you."+
  " Just say the keyword " + "<b><span style='color: rgba(15, 14, 14, 0.782);'>" + "Google" + 
  "</span></b>" + " or "+ "<b><span style='color: rgba(15, 14, 14, 0.782);'>" +  "Wikipedia" + 
  "</span></b>" + ", followed by the info you need. If you are a Smartie," + 
  " use the keyword " + "<b><span style='color: rgba(15, 14, 14, 0.782);'>" + 
  "Paper" + "</span></b>" + " to find scientific articles!";

  synth.cancel;

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

  if(!stop){
    if(!assistantIsSpeaking){
       recognition.start();   
    }
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

    recognition.addEventListener('result', handleSpeechRecognition);          
  }, 2000); 
assistantIsSpeaking = false;
});


/*
* Removing SpeechRecognition when SpeechSynthesis starts.
*/
speech.addEventListener('start', (event) => {

  console.log("in function speech addEventListener start " + event);
  assistantIsSpeaking = true;
  
  myTimeout = setTimeout(myTimer, 10000);
  recognition.removeEventListener('result', handleSpeechRecognition);
  recognition.stop();
});

/*
* Recognizing the users utterance and converting it into text in the chat window.
*/
function handleSpeechRecognition(event) {

  console.log("In function handleSpeechRecognition " + event);
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
      console.log("! iteration2: " + event.resultIndex);       
      event.results[event.resultIndex][0].transcript = '';
      recognition.removeEventListener('result', handleSpeechRecognition);
      recognition.stop();
  }
}

// Handle beforeunload event to stop the speech synthesis when page is refreshed
window.addEventListener('beforeunload', function() {
  synth.cancel();
  synth = null;
  speech = null;
});
