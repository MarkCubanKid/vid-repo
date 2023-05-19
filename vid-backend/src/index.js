const express = require('express');
const bodyParser = require('body-parser');
var axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Define your expected security key
const expectedSecurityKey = 'YOUR_EXPECTED_SECURITY_KEY';

// Define a route to handle the webhook notifications
app.post('/vidyard-webhook', (req, res) => {
  const event = req.body;
  const receivedSecurityKey = req.headers['x-vidyard-signature'];

  // Verify the security key
  if (receivedSecurityKey === expectedSecurityKey) {
  
    var data = JSON.stringify({
      "description": "From Video",
      "subject": "From vidyard to ticket",
      "email": "jeron.mohan@freshworks.com",
      "priority": 1,
      "status": 2
    });
    
    var config = {
      method: 'post',
      url: 'https://freshworks8867.freshdesk.com/api/v2/tickets',
      headers: { 
        'Authorization': 'Basic TEljcVhjOXRUODFvTU5HcGxlbG0=', 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
    .then(function (data) {
      console.log(JSON.stringify(data.data));
      console.log('Received an valid Vidyard webhook');
      const response = {
        message: 'Webhook received and verified successfully',
        event: event
      };
      res.json(response);
    })
    .catch(function (error) {
      console.log(error);
      res.status(403).json({ message: 'Cannot create FD ticket' });
    });
    
   
   
  } else {
    // Security key is invalid
    console.log('Received an invalid Vidyard webhook');
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Start the server
const port = 3000; // Replace with your desired port number
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
