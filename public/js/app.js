const numberField = document.querySelector('input[name=number]');
const textField = document.querySelector('input[name=text]');
const button = document.querySelector('input[type=button]');
const msg = document.querySelector('.response');

textField.addEventListener('keyup', (e) => {
  if ((e.keyCode || e.charCode) === 13) send();
}, false);

button.addEventListener('click', send, false);

const send = () => {
  const number = numberField.value.replace(/\D/g, ''); // Remove all NaN chars
  const text = textField.value;
};
