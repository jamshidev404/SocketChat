let socket = io();
//let Mustache = require("mustache");

function scrollToBottom() {
  let messages = document.querySelector("#messages").lastElementChild;
  messages.scrollIntoView();
}

socket.on("connect", function () {
  let searchQuery = window.location.search.substring(1)
  let params = JSON.parse('{"' + decodeURI(searchQuery).replace(
      /&/g, '","').replace(/\+/g, '').replace(/=/g, '":"') + '"}');

  socket.emit('join', params, function() {
    if(err) {
      alert(error);
      window.location.href = '/'
    }else {
      console.log("No error")
    }
  })

});
socket.on("disconnect", function () {
  console.log("Disconnected from server");
});

socket.on('updateUsersList', function () {
  let ol = document.createElement('ol')

  users.forEach(function () {
    let li = createElement("li")
    li.innerHTML = user;
    ol.appendChild(li)
  });

  let usersList = document.querySelector("#users")
})

socket.on("newMessage", function (message) {
  const formattedTime = moment(message.createdAt).format("LT");
  const template = document.querySelector("#message-template").innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime,
  });

  const div = document.createElement("div");
  div.innerHTML = html;

  document.querySelector("#messages").appendChild(div);
  scrollToBottom();
});

socket.on("newLocationMessage", function (message) {
  const formattedTime = moment(message.createdAt).format("LT");
  const template = document.querySelector(
    "#location-message-template"
  ).innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime,
  });

  const div = document.createElement("div");
  div.innerHTML = html;

  document.querySelector("#messages").appendChild(div);
  scrollToBottom();
});

document.querySelector("#submit-btn").addEventListener("click", function (e) {
  e.preventDefault();

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: document.querySelector('input[name="message"]').value,
    },
    function () {}
  );
});

document
  .querySelector("#send-location")
  .addEventListener("click", function (e) {
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser!");
    }
    navigator.geolocation.getCurrentPosition(
      function (position) {
        socket.emit("createLocationMessage", {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      function () {
        alert("Unable to fetch location");
      }
    );
  });
