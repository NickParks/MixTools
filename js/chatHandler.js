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
                    //Store recent 100 messages in array
                    var recentMessages = JSON.parse(getItem("recent-messages"));
                    if (recentMessages.length >= 100) {
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

                    console.log("Pushed message with ID", message.id);

                    //Check for and update unique chatters
                    var uniqueChatters = JSON.parse(getItem("unique-chatters"));

                    if (uniqueChatters.indexOf(data.data.user_id) == -1) {
                        uniqueChatters.push(data.data.user_id);
                        $("#unique-chatters").text(uniqueChatters.length);
                    }

                    setItem("unique-chatters", JSON.stringify(uniqueChatters));
                }

                //Deleted message
                if (data.event == "DeleteMessage") {
                    //Get the deleted message info
                    console.log(data);
                    var deleted_message = getMessageById(data.data.id);

                    console.log(deleted_message);

                    var deletedMessage = {
                        mod_name: data.data.moderator.user_name,
                        chat_message: deleted_message.msg,
                        deleted_name: deleted_message.sender
                    }

                    var markup = `${deletedMessage.mod_name} deleted a message by ${deletedMessage.deleted_name}: ${deletedMessage.chat_message}`;
                    addToTable("deleted-messages-table", markup);
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
 * Gets a message from the Recent Message array by ID
 * 
 * @param {any} id The ID of the message object
 * @returns Recent message Object
 */
function getMessageById(id) {
    var recentMessages = JSON.parse(getItem("recent-messages"));

    var deletedMsg; //Leave as undefined for now

    recentMessages.forEach((msg) => {
        if (msg.id == id) {
            deletedMsg = msg;
        }
    });

    return deletedMsg; //Return either undefined if not found, or the DeletedMsg Object
}

/**
 * Closes the chat socket
 */
function closeChat() {
    chatSocket.close();
}