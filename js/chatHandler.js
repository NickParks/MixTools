var chatSocket;

function connectToChat(id) {
    $.get("https://mixer.com/api/v1/chats/" + id + "/anonymous", (data) => { }).done((data) => {
        //Connect to chat
        var num = generateRandNumb(0, data.endpoints.length);
        console.log(num);
        chatSocket = new WebSocket(data.endpoints[num]);

        chatSocket.addEventListener('open', (event) => {
            console.log("Connected to chat socket");
        });

        chatSocket.addEventListener('error', (event) => {
            console.log("WebSocket error", event.data);
            return connectToChat(id); //Just recursivly keep trying to reconnect
        });

        chatSocket.addEventListener('message', (event) => {
            //Listen to different events sent
            var data = JSON.parse(event.data);
            console.log(data);
            if(data.type == "event") {
                if(data.event == "WelcomeEvent") {
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
            }

        });

    }).fail((data) => {
        alert("Failed to connect to chat.");
    });
}

function closeChat(){
    chatSocket.close();
}