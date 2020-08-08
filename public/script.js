const socket = io();
const peer = new Peer();

const mediaAccessor = navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
});

// get the video-grid from html
const videoGrid = document.getElementById("video-grid");

// create the video stream in FE

// stream the video to the video tag
mediaAccessor.then((stream) => {
  insertStreamToVideo(stream);

  socket.on("user-connected", (userId) => {
    handleNewUserJoin(userId, stream);
  });
  peer.on("call", function (call) {
    console.log("Some one call me");
    call.answer(stream); // Answer the call with an A/V stream.
    call.on("stream", function (remoteStream) {
      insertStreamToVideo(stream);
    });
  });
});

peer.on("open", (id) => {
  console.log("Open peer with id: " + id);
  socket.emit("join-room", ROOM_ID, id);
});
function handleNewUserJoin(userId, myStream) {
  console.log("New user joined: " + userId);
  var call = peer.call(userId, myStream);
  call.on("stream", function (remoteStream) {
    // Show stream in some video/canvas element.
    console.log("I call: " + userId);
    insertStreamToVideo(remoteStream);
  });
}

// insert the stream video to video tag
const insertStreamToVideo = (stream) => {
  const videoObject = document.createElement("video");
  videoObject.muted = true;
  videoObject.srcObject = stream;
  // After load the stream ok, play it
  // attach it to the html, add join the room through socket
  videoObject.addEventListener("loadedmetadata", () => {
    videoObject.play();
    videoGrid.appendChild(videoObject);
  });
};
