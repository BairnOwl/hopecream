var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

//app.set('views', __dirname + '/templates');

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
});

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'hopecream') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
});

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    console.log('sending text message');

    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            //sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
            receivedMessage(event);
        }
    }
    res.sendStatus(200)
})

var token = "EAAWVXESZCZAYYBALrnQnUpfNhDOV0xBiaLG9g5Qd30CaoYqC2TsYTrfgzMXVgwe2ZAzn7Hu4yRV2Wn8SabwAqpuefKIE4ImSJyYc6DNDtZC7GFJmzYLPdP00oZBS1kYSxlEliLCoR4mrmdHjsG7jpdlxgX7kQozOhpZCErOHWsuQZDZD"


// function sendTextMessage(sender, text) {
//     messageData = {
//         text:text
//     }
//     request({
//         url: 'https://graph.facebook.com/v2.6/me/messages',
//         qs: {access_token:token},
//         method: 'POST',
//         json: {
//             recipient: {id:sender},
//             message: messageData,
//         }
//     }, function(error, response, body) {
//         if (error) {
//             console.log('Error sending messages: ', error)
//         } else if (response.body.error) {
//             console.log('Error: ', response.body.error)
//         }
//     })
// }


function receivedMessage(event) {
  var senderID = event.sender.id;
  //var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    switch (messageText) {
    	case 'hi':
	    	var messageData = {
			    recipient: {
			      id: senderID
			    },
			    message: {
			      text: 'Hi! Welcome to Hope Cream. Would you like to know what flavors we have available?'
			    }
			  };

			callSendAPI(messageData);
			break;

		case 'yes':
			var messageData = {
				recipient: {
					id: senderID
				},
				message: {
					text: 'Hold the Cone, Fruit Frenzy, Skinny Cow. Look for one of our sales agents around campus to get your Hope Cream today!'
				}
			};

			callSendAPI(messageData);
			break;

		break;

 
      default:
        sendTextMessage(senderID, messageText);
    }
  }
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: 'I\'m just a bot. :) Do you want to know what flavors we have available?'
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: token },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
});