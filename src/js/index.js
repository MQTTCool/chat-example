/*
  Copyright (c) Lightstreamer Srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

require(['MQTTExtender'], function(MQTTExtender) {
  // Connect to the MQTT Extender hosted at 'localhost' and listening on TCP
  // port 8080.
  MQTTExtender.connect('http://localhost:8080', {

    onConnectionSuccess: function(mqttExtenderSession) {
      // Create a MQTT client instance ready to connect to the configured MQTT
      //broker.
      var mqttClient = mqttExtenderSession.createClient('mosquitto');

      // Connect to the MQTT broker.
      mqttClient.connect({
        onSuccess: function() {
          // Once connected, subscribe to the 'chat' topic.
          mqttClient.subscribe('chat');
        }
      });

      // Called upon receiving a chat message.
      mqttClient.onMessageArrived = function(message) {
        // Message received.
        $('#messages')
          .append($('<div>')
            .text(message.payloadString)
            .addClass('messageContainer')) //append the message
          .scrollTop($('#messages')
            .prop('scrollHeight')); //move the scrollbar on the bottom
      };

      // Called when the client loses its connection.
      mqttClient.onConnectionLost = function(responseObject) {
        if (responseObject.errorCode !== 0) {
          console.log('Error: ' + responseObject.errorCode + ' ' +
            responseObject.errorMessage);
        }
      };

      // Enable the submission form.
      $('input').prop('disabled', false);
      $('#submitForm').submit(function(event) {
        event.preventDefault();

        // Get value from the user input and send to MQTT topic.
        var text = $('#user_message').val();
        mqttClient.send('chat', text);

        // Clear the user input.
        $('#user_message').val('');
      });
    }
  });
});