const socket = io();
const peer = new Peer();

const videoStreamSet = new Set();

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
  // if someone call me, answer them with my stream video
  peer.on("call", function (call) {
    console.log("Some one call me");
    call.answer(stream); // Answer the cal with an A/V stream.
    // the people call you will stream their video for you.
    call.on("stream", function (remoteStream) {
      if (!videoStreamSet.has(remoteStream.id)) {
        videoStreamSet.add(remoteStream.id);
        insertStreamToVideo(remoteStream);
      }
    });
  });
});

// open browser with unique id
peer.on("open", (id) => {
  console.log("Open peer with id: " + id);
  // join the room with unique id, this id will be broadcast to other to call you.
  socket.emit("join-room", ROOM_ID, id);
});

// when new user join, call them with myStream
function handleNewUserJoin(userId, myStream) {
  console.log("New user joined: " + userId);
  var call = peer.call(userId, myStream);
  call.on("stream", function (remoteStream) {
    // Show stream in some video/canvas element.
    if (!videoStreamSet.has(remoteStream.id)) {
      videoStreamSet.add(remoteStream.id);
      insertStreamToVideo(remoteStream);
    }
  });
}

// insert the stream video to video tag
const insertStreamToVideo = (stream) => {
  console.log("Insert new stream: ", stream);
  const videoObject = document.createElement("video");
  videoObject.muted = true;
  videoObject.srcObject = stream;
  // After load the stream ok, play it
  // attach it to the html, add join the room through socket
  videoObject.addEventListener("loadedmetadata", () => {
    videoObject.play();
    videoGrid.appendChild(videoObject);
    // videoObject.muted = false;
  });
};
