const mic = document.getElementById('mic');
const messages_area = document.querySelector('.messages_area');
const chats = document.querySelector('.chats');
const notchat = document.getElementById('notchat');
const femaleBtn = document.querySelector(".female");
const maleBtn = document.querySelector(".male");
const speech = new SpeechSynthesisUtterance();

let iteration = 0;
let recognition = null;
let paperBoolean = false;
let fetchPromise = null;
let askedWikiInformation = false;
let wordUrl1 = null;
let wikiSummary = null;

var gptResponse = false;
var paperIDnumber = 0;
var paperNumber = null;
var paperTitle = "";
var stop = false;


/*
*  Creating SpeechRecognition Object, if the browser supports it.
*/
try {
    // check if SpeechRecognition is supported by the users browser
    if (('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window)){
      var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;

      console.log(`browser supported`);
    
    } else {
        // SpeechRecognition is not supported by the users browser
        console.log(`browser NOT supported`);
        alert("Please use Chrome browser!");
    
    }
} catch (error) {
    console.error(error);
    alert("Please use Chrome browser!");
}

/*
* Show user message in the chat window.
* @param msg: the spoken message by the user
* @return: the message shown in the chat
*/
function userMSg(msg){
    let output = '';
    output += `<p class="message right">${msg}</p>`;
    chats.innerHTML += output;

    //messages_area.scrollTop = messages_area.scrollHeight;
    return chats;   
}

/*
* Show assistants message in the chat window.
* @param msg: the generated message by the assistant
* @return: the message shown in the chat
*/
function assistantSpeak(msg){
    let output = '';
    output += `<p class="message left">${msg}</p>`;
    chats.innerHTML +=  output;

    messages_area.scrollTop = messages_area.scrollHeight;
    return chats;
}


/*
* Selecting the assistant answer accorning to the users input.
* @param msg: user voice input
*/
function assistantMsg(msg){

    // setting up assistants voice
    speech.text = "";
    speech.volume = 1;
    speech.pitch = 0.9;
    speech.rate = 0.95;
    
    paperBoolean = false;

    if (!('speechSynthesis' in window)) {
        alert("Please use Chrome browser!");

    } else {

        if (msg.trim().length !== 0){

            if (msg.toLowerCase().includes('who are you') || msg.toLowerCase().includes('what is your name')) {
                let result = intro[Math.floor(Math.random() * intro.length)]
                speech.text = result;
                gptResponse = false;
            }
        
            else if (msg.toLowerCase().includes('thank you')) {
                const result = thanks[Math.floor(Math.random() * thanks.length)];
                speech.text = result;
                gptResponse = false;
            }
        
            else if (msg.toLowerCase().includes('no')) {
                speech.text = "as you wish";  
                gptResponse = false;          
            } 
            else if (msg.toLowerCase().includes('okay stop')|| msg.toLowerCase().includes('Api stop')) {
                speech.text = "API is turning off...";  
                recognition.continuous = false;
                gptResponse = false;  
                stop = true;
                recognition.stop(); 
                mic.style.pointerEvents = "";   
                stop = false;    
            } 

            else if (msg.toLowerCase().includes('yes')) {
                myTimer();
                speech.text = wikiSummary;  
                gptResponse = false;           
            } 
    
            else if (msg.toLowerCase().includes('wikipedia')) {
                // if the user says  "wikipedia Paris",  the word "wikipedia" is REPLACED with empty string and only
                // the word Paris is taken into account
                askedWikiInformation = true;
                window.open(`https://en.wikipedia.org/wiki/${msg.toLowerCase().replace("wikipedia", "")}`, "_blank");
                const result = "showing result for " + msg.toLowerCase().replace("wikipedia", "") + " on wikipedia";
                speech.text = result;
                gptResponse = false;

                messages_area.append(assistantSpeak(result));
                window.speechSynthesis.speak(speech);

                // providing the endpoint with the text for the asked wikipedia article
                let word = msg.toLowerCase().replace("wikipedia", "");
                let url1 = 'https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&exintro&explaintext&redirects=1&titles=';
                wordUrl1 = url1 + word;
                console.log(wordUrl1);

              return;
            }
    
            else if (msg.toLowerCase().includes('google')) {
                // if the user says  "google Paris",  the word "google" is REPLACED with empty string and only
                // the word Paris is taken into account
                msg = msg.toLowerCase().replace("google", "")
    
                result = "I found something about " + msg + " on google!";
                speech.text = result;
                
                window.open(`http://google.com/search?q=${msg}`, "_blank");
                gptResponse = false;
            }  

            // looking up for papers in SemanticScholar
            else if (msg.toLowerCase().includes(('paper')) || msg.toLowerCase().includes(('people')))  {
                if(msg.toLowerCase().includes(('paper'))){
                    msg = msg.toLowerCase().replace("paper", "");
                } 
                else {
                    msg = msg.toLowerCase().replace("people", "");
                }
  
               let url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${msg}`;

                fetchPromise = new Promise((resolve, reject) =>{

                    fetch(url)
                    .then(response => response.json())
                    .then(body => {

                      paperNumber = Math.floor(Math.random() * 10);
                      console.log("paper array length: " + (body.data.length-1));

                      paperTitle = body.data[paperNumber].title;
                      paperIDnumber = body.data[paperNumber].paperId;

                      console.log(paperTitle);
                      console.log("in " + paperIDnumber);
                      console.log(paperNumber);
                    })
                    .catch(error => console.error(error));

                    resolve("fetchPromise resolved");
                });
                    
                gptResponse = false;
                paperBoolean = true;
            } 

            else {
                gptResponse = true;
            }
    
            if(!gptResponse){

                // all functions to be spoken by the assistant, except paper search
                if(!paperBoolean){
                    messages_area.append(assistantSpeak(speech.text));
                    window.speechSynthesis.speak(speech);

                // only paper search option to be spoken by the assistant
                } else {
                    Promise.all([fetchPromise])
                    .then((message) =>{

                        setTimeout(function() {

                            result = "I found a paper about  " + msg + " with the following title: " + 
                            "<b><span style='color: rgba(15, 14, 14, 0.782);'>" + paperTitle + "</span></b>"
    
                            speech.text = result
    
                            setTimeout(function() {
                                window.open(`https://www.semanticscholar.org/paper/${paperIDnumber}`, "_blank")
                               }, 1000) 
    
                            console.log(message)
                            messages_area.append(assistantSpeak(speech.text))
    
                            if(result.toLowerCase().includes(("<b><span style='color: rgba(15, 14, 14, 0.782);'>"))){
                                result = result.toLowerCase().replace("<b><span style='color: rgba(15, 14, 14, 0.782);'>", "");
    
                                if(result.toLowerCase().includes(("</span></b>"))){
                                    result = result.toLowerCase().replace("</span></b>", "");         
                                } 
                            } 
                            speech.text = result;
                            window.speechSynthesis.speak(speech);

                        }, 2000) 
 
                    })
                    .catch(error => console.error(error));
                }
            // it is a GPT response
            // call getGPTmessage function 
            } else {

                async function anotherAsyncFunction() {
                var result2 =  await getGPTmessage(msg);
                    
                messages_area.append(assistantSpeak(result2));
                window.speechSynthesis.cancel();

                speech.text = result2;
                window.speechSynthesis.speak(speech);
                }

                anotherAsyncFunction();
            }  
        }        
    }
}

/*
* Salutes the user, using the current time of its operating system.
*/
 function saluteToDaytime(){
    let salute = "";
    let day = new Date();
    let hour = day.getHours();

    if(hour >= 0  && hour < 12){
        salute = "good morning!";

    } else if(hour == 12){
        salute = "good noon!";

    } else if(hour > 12  && hour <= 17){
        salute = "good afternoon!";

    } else {
        salute = "good evening!";
    }

    return salute;
}

/*
* Pause and resume speech-synthesis every 10 sec to avoid speech-synthesis errors in long texts.
*/
function myTimer() {
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
    myTimeout = setTimeout(myTimer, 10000);
}

//divide long texts, not used yet
function readLongText(text) {
    // Split the text in two parts
    const middleIndex = Math.ceil(text.length / 2);
    const firstPart = text.slice(0, middleIndex);
    const secondPart = text.slice(middleIndex);
  
    // Create a new SpeechSynthesisUtterance object for each part
    const firstUtterance = new SpeechSynthesisUtterance(firstPart);
    const secondUtterance = new SpeechSynthesisUtterance(secondPart);
  
    // Add an event listener to the first utterance to start the second one when it finishes
    firstUtterance.addEventListener("end", () => {
      window.speechSynthesis.speak(secondUtterance);
    });
  
    // Start reading the first utterance
    window.speechSynthesis.speak(firstUtterance);
}
