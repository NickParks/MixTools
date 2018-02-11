var chatSocket;

/**
 * Starts the main chat process. Connects to a random chat endpoint that is 
 * received after querying the mixer chat api
 * 
 * @param {any} id The channel ID
 */
function connectToChat(id) {
    $.get("https://mixer.com/api/v1/chats/" + id + "/anonymous", (data) => {}).done((data) => {
        //Connect to chat
        var num = generateRandNumb(0, data.endpoints.length - 1);
        chatSocket = new WebSocket(data.endpoints[num]);

        chatSocket.addEventListener('open', (event) => {
            console.log("Connected to chat socket");
        });

        chatSocket.addEventListener('error', (event) => {
            console.log("WebSocket error", event.data);
            return connectToChat(id); //Just recursively keep trying to reconnect
        });

        chatSocket.addEventListener('message', (event) => {
            //Listen to different events sent
            var data = JSON.parse(event.data); //Parse the event data

            if (data.type == "event") {
                //Welcome event - called on first connect
                if (data.event == "WelcomeEvent") {
                    //Connect to chat so we can start getting live events
                    var authPacket = {
                        "type": "method",
                        "method": "auth",
                        "arguments": [
                            id
                        ],
                        "id": 0
                    }

                    chatSocket.send(JSON.stringify(authPacket));
                }

                //Chat event
                if (data.event == "ChatMessage") {
                    //Store recent 30 messages in array
                    var recentMessages = JSON.parse(getItem("recent-messages"));
                    if (recentMessages.length >= 30) {
                        recentMessages.shift();
                    }

                    //Handle the message and store it in an object
                    var message = {
                        id: data.data.id,
                        msg: buildMsg(data.data.message.message),
                        sender: data.data.user_name
                    }

                    recentMessages.push(message);
                    setItem("recent-messages", JSON.stringify(recentMessages));

                    //Check for and update unique chatters
                    var uniqueChatters = JSON.parse(getItem("unique-chatters"));

                    if (uniqueChatters.indexOf(data.data.user_id) == -1) {
                        uniqueChatters.push(data.data.user_id);
                        $("#unique-chatters").text(uniqueChatters.length);
                    }

                    setItem("unique-chatters", JSON.stringify(uniqueChatters));
                }
            }
        });
    }).fail((data) => {
        alert("Failed to connect to chat.");
    });
}

/**
 * Builds the full user message from the message array
 * 
 * @param {any} messages The message array
 * @returns A string of the message
 */
function buildMsg(messages) {
    var message = "";

    messages.forEach(obj => {
        message += obj.text;
    });

    return message.trim();
}

/**
 * Closes the chat socket
 */
function closeChat() {
    chatSocket.close();
}