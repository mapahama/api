main();

async function main() {
  await speak("Say something");
  var spokenWord = await hear();
  await speak(spokenWord);
}

async function speak(message) {
  return new Promise((resolve, reject) => {
    var synth = window.speechSynthesis;
    var utterThis = new SpeechSynthesisUtterance(message);
    synth.speak(utterThis);
    utterThis.onend = resolve;
  });
}

async function hear() {
  return new Promise((resolve, reject) => {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.start();

    recognition.onresult = function (event) {
        var current = event.resultIndex;
        var transcript = event.results[current][0].transcript;
        console.log(transcript);
        recognition.stop();
        resolve(transcript);
    }
  });
}
