var myTimeout;
/*
*Using OpenAI API to send user questions to gpt-3.5-turbo model and return answers.
*@param input:  user question
*@return: answer from gpt model
*/
async function getGPTmessage(input) {
  
  //var data = window.message;  
  var data = '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';
  var result1 = null;
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${data}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: input}],
      max_tokens: 300
    })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();
    console.log(data);

    result1 = data.choices[0].message.content;
  
  } catch (error){
    console.log(error);
  }
  return result1;

}








