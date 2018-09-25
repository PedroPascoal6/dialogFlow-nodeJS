'use strict';

//------------------------------------------------------------- QUICK START VAR INIT-------------------------------------------------------------
// [START dialogflow_quickstart]
// You can find your project ID in your Dialogflow agent settings
const projectId = 'chatbotexample-32cd5'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'quickstart-session-id';
const languageCode = 'en-US';
// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: 'ChatBotExample-b7f942bae2ff.json',
});

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);
//------------------------------------------------------------- QUICK START END -------------------------------------------------------------

const express = require('express');
const bodyParser = require('body-parser');
const quickstart = require('./quickstart');

// Create a new instance of express
const app = express();

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({extended: false}));

// Route that receives a POST request to /sms
app.post('/sms', function(req, res) {
  const body = req.body.tfield;
  const request = addRequest(body);
  res.set('Content-Type', 'text/plain');
  //CONNECT TO DIALOG FLOW AND TAKE A RESPONSE
  sessionClient
    .detectIntent(request)
    .then(responses => {
      console.log('Detected intent');
      const result = responses[0].queryResult;
      console.log(`  Query: ${result.queryText}`);
      console.log(`  Response: ${result.fulfillmentText}`);
      res.send(`Response: ${result.fulfillmentText}`);
      if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
      } else {
        console.log(`  No intent matched.`);
      }
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  console.log('END');
});

exports.getSometing = async function createDialogFlowResult(request) {
  return await quickstart.sendRequest(request);
};

// Tell our app to listen on port 3000
app.listen(3000, function(err) {
  if (err) {
    throw err;
  }
  console.log('Server started on port 3000');
});

function addRequest(body) {
  // The text query request.
  let request;
  return (request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: body,
        languageCode: languageCode,
      },
    },
  });
}

function sendRequestInner(request) {
  // Send request and log result
  sessionClient
    .detectIntent(request)
    .then(responses => {
      console.log('Detected intent');
      const result = responses[0].queryResult;
      console.log(`  Query: ${result.queryText}`);
      console.log(`  Response: ${result.fulfillmentText}`);
      const dialogResponse = result.fulfillmentText;
      if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
      } else {
        console.log(`  No intent matched.`);
      }
      return dialogResponse;
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}
