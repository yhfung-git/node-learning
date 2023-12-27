const displayFlashMessage = (messageType, message) => {
  const flashMessage = document.createElement("div");

  flashMessage.classList.add("alert");
  flashMessage.classList.add(`alert--${messageType}`);

  flashMessage.textContent = message;

  const flashMessagesContainer = document.getElementById(
    "flash-messages-container"
  );

  flashMessagesContainer.appendChild(flashMessage);
};

export { displayFlashMessage };
