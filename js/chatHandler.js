var chatSocket;

function connectToChat(id) {
    $.get("https://mixer.com/api/v1/chats/" + id + "/anonymous", (data) => { }).done((data) => {
        //Connect to chat
        console.log(data.endpoints[0]);
        chatSocket = new WebSocket(data.endpoints[0]);

        chatSocket.addEventListener('open', (event) => {
            console.log("Connected to chat socket");
        });

        chatSocket.addEventListener('error', (event) => {
            console.log("WebSocket error", event.data);
        });

        chatSocket.addEventListener('message', (event) => {
            console.log('Message from server', event.data);
        });

    }).fail((data) => {
        alert("Failed to connect to chat.");
    });
}