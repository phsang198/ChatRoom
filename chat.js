const ws = new WebSocket("ws://localhost:6789");

ws.onopen = () => {
  console.log("Connected to WebSocket server");
};
ws.onmessage = (event) => {
  const messages_view = document.getElementById("messages");
  const message = JSON.parse(event.data);
  if (message.type === "info") 
  {
    messages_view.innerHTML += `
<p>${message.message}</p>`;

      document.getElementById("roomId").disabled = true;
    document.getElementById("userId").disabled = true;
    var button =  document.getElementById("joinRoomBtn") ;
    button.disabled = true; 

  } else 
  if (message.type === "chat") 
  {
    messages_view.innerHTML += `
<p>
  <strong>${message.userId}:</strong> ${message.message}
</p>`;
  }else 
  if (message.type === "fail") 
  {
    messages_view.innerHTML += `
<p>${message.message}</p>`;
      }
      else 
      if (message.type === "game") 
      {
        const userId = document.getElementById("userId").value;
        if (userId === message.userId)
        {
          
          //console.log(message.from, message.to); 
        }
        else 
        {
          onDrop2(message.from, message.to);
        }
      }
  messages_view.scrollTop = messages_view.scrollHeight;
};
ws.onclose = () => {
  console.log("Disconnected from WebSocket server");
};


window.onload=function(){
  document.getElementById("message")
  .addEventListener("keydown", function (event)
  {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("sendMessageBtn").click();
    }
  });
  document.getElementById("joinRoomBtn").onclick = function joinRoom() {
    const roomId = document.getElementById("roomId").value;
    const userId = document.getElementById("userId").value;
    if (roomId && userId) {
      ws.send(JSON.stringify({
        type: "join_room",
        roomId,
        userId
      }));
    }
  }
  document.getElementById("sendMessageBtn").onclick =  function sendMessage()  {
    const roomId = document.getElementById("roomId").value;
    const userId = document.getElementById("userId").value;
    const message = document.getElementById("message").value;
  
    console.log("Sending message to room", roomId, ":", message);
    if (message && roomId && userId) {
      ws.send(JSON.stringify({
        type: "chat",
        roomId,
        userId,
        message
      }));
      
      document.getElementById("message").value = "";
    }
  }
}
