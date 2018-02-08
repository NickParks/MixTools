var chatSocket;

function connectToChat(id) {
    $.get("https://mixer.com/api/v1/chats/" + id + "/anonymous", (data) => { }).done((data) => {
        //Connect to chat
        chatSocket = new WebSocket(data.endpoints[generateRandNumb(0, data.endpoints.length)]);

        chatSocket.addEventListener('open', (event) => {
            console.log("Connected to chat socket");
        });

        chatSocket.addEventListener('error', (event) => {
            console.log("WebSocket error", event.data);
            return connectToChat(id); //Just recursivly keep trying to reconnect
        });

        chatSocket.addEventListener('message', (event) => {
            console.log('Message from server', event.data);
        });

    }).fail((data) => {
        alert("Failed to connect to chat.");
    });
}