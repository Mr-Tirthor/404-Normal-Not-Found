const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const sidebarScrim = document.querySelector(".sidebar-scrim");
const accountFeedback = document.querySelector(".account-feedback");
const accountJokeDialog = document.querySelector(".account-joke-dialog");
const accountJokeTitle = document.querySelector("#account-joke-title");
const accountJokeMessage = document.querySelector("#account-joke-message");
const previousJokes = new Map();

function setMenuOpen(isOpen) {
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Menu band karo" : "Menu kholo");
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

sidebarScrim.addEventListener("click", () => setMenuOpen(false));
sidebar.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

const processMessages = {
  name: "Naam update process shuru. Official ID ke saath branch ya secure banking channel par verify karna hoga.",
  phone: "Phone update process shuru. Naye number ki verification secure channel par hogi; yahan OTP nahi aayega.",
  identity: "Identity proof update process shuru. Original proof verification ke liye ready rakhna; file yahan upload nahi hoti.",
};

const processJokes = {
  name: [
    "Naam badalne ki request manager tak pahunchi. Manager apna naam yaad karne gaye.",
    "Spelling correction form sahi spelling dhoondhne gaya hai.",
    "Naam update queue mein hai. Queue ka number abhi naam se hi bula rahe hain.",
  ],
  phone: [
    "OTP bhejne ke liye phone dhoondh rahe hain. Phone bhi apna update karwana chahta hai.",
    "Number update line busy hai; number khud kisi aur call par laga hua hai.",
    "Verification call aayegi. Phone silent mode mein meditation kar raha hai.",
  ],
  identity: [
    "Scanner ne proof dekhne se pehle apni identity verify karne ko bola.",
    "Original ID ready rakhna. Photocopy machine ne copy ko apna bana liya.",
    "Proof verification queue mein hai. Stapler ne file ko officially pakad rakha hai.",
  ],
};

const processTitles = {
  name: "Naam update request",
  phone: "Phone update request",
  identity: "Identity proof request",
};

function showAccountJoke(process) {
  const jokes = processJokes[process];
  let jokeIndex = Math.floor(Math.random() * jokes.length);
  if (jokeIndex === previousJokes.get(process)) jokeIndex = (jokeIndex + 1) % jokes.length;
  previousJokes.set(process, jokeIndex);
  accountJokeTitle.textContent = processTitles[process];
  accountJokeMessage.textContent = jokes[jokeIndex];
  accountJokeDialog.showModal();
  accountJokeDialog.classList.remove("is-opening");
  void accountJokeDialog.offsetWidth;
  accountJokeDialog.classList.add("is-opening");
}

document.querySelectorAll(".account-process-option").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".account-process-option").forEach((option) => {
      option.classList.toggle("is-selected", option === button);
      option.setAttribute("aria-pressed", String(option === button));
    });
    accountFeedback.textContent = processMessages[button.dataset.process];
    showAccountJoke(button.dataset.process);
  });
});

accountJokeDialog.querySelectorAll(".slip-error-close, .slip-error-dismiss").forEach((button) => {
  button.addEventListener("click", () => accountJokeDialog.close());
});

accountJokeDialog.addEventListener("click", (event) => {
  if (event.target === accountJokeDialog) accountJokeDialog.close();
});