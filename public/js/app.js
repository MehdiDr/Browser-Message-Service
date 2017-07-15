/*  global fetch:true */
/*  global document:true  */
/*  global Notification:true  */
/*  global localStorage:true  */


// DOM
const numberField = document.querySelector('input[name=number]');
const textField = document.querySelector('input[name=text]');
const button = document.querySelector('input[type=button]');
const msg = document.querySelector('.response');

// Web Notification permission
let permission = 'denied';

try {
  Notification.requestPermission().then((status) => {
    permission = status;
  });
} catch (error) { // Safari 9 doesn't return a promise for requestPermissions
  Notification.requestPermission((status) => {
    permission = status;
  });
}

// socket.io
const socket = io();
socket.on('connect', () => {
  console.log('Socket connected');
});
socket.on('smsStatus', (data) => {
  if (!data) return;
  if (data.error) {
    displayStatus('Error: ' + data.error, permission);
  } else {
    displayStatus('Message ID ' + data.id + ' successfully sent to ' + data.number, permission);
  }
});

const lastNumber = localStorage.getItem('number');
if (lastNumber) {
  numberField.value = lastNumber;
}

function displayStatus(message, notification) {
  console.log(notification);

  if (notification === 'granted') { // web notification
    const notification = new Notification('Nexmo', {
      body: message,
      icon: 'images/icon-nexmo.png',
    });
  } else { // Notification is denied by a user. just show text
    msg.classList.add('poof');
    msg.textContent = message;
    msg.addEventListener('animationend', () => {
    msg.textContent = '';
    msg.classList.remove('poof');
    }, false);
  }
}
// Send data to server to send a SMS via Nexmo
function send() {
  const number = numberField.value.replace(/\D/g, ''); // Remove all non-numeric chars
  if (!number) return;

  const text = textField.value || 'Hello!';

  localStorage.setItem('number', number);

  if(!self.fetch) {
    alert("Bummer, your browser doesn't support Fetch API!");
    return;
    // Ideally, use XHR as the fallback for fetch.
  }

  fetch('/', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      number: number,
      text: text,
    }),
  }).then((response) => {
    if (response.status !== 200) {
      displayStatus(statusText, notification);
    }
    textField.value = '';
  }).catch((e) => {
    displayStatus(e, notification);
  });
}
// UI Events
textField.addEventListener('keyup', (e) => {
  (e.keyCode || e.charCode) === 13 && send()
}, false);
button.addEventListener('click', send, false);
