const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const sidebarScrim = document.querySelector(".sidebar-scrim");
const transactionForm = document.querySelector(".transaction-form");
const formFeedback = document.querySelector(".form-feedback");
const errorDialog = document.querySelector(".slip-error-dialog");
const errorMessage = document.querySelector(".slip-error-message");
let previousFailureIndex = -1;
let previousWithdrawalFailureIndex = -1;

function setMenuOpen(isOpen) {
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
}

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".transaction-heading, .transaction-form-panel, .transaction-info-panel").forEach((element) => {
    element.classList.add("reveal-ready");
    revealObserver.observe(element);
  });
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

sidebarScrim.addEventListener("click", () => setMenuOpen(false));
sidebar.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

function showTransactionNotice(message) {
  errorMessage.textContent = message;
  errorDialog.showModal();

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    errorDialog.classList.remove("is-opening");
    void errorDialog.offsetWidth;
    errorDialog.classList.add("is-opening");
    transactionForm.querySelector(".form-submit").animate([
      { transform: "translateY(0) scale(1)" },
      { transform: "translateY(-4px) scale(1.025)" },
      { transform: "translateY(0) scale(1)" },
    ], { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" });
  }
}

transactionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const action = transactionForm.dataset.transaction;

  if (action === "withdrawal") {
    const amountField = transactionForm.querySelector('[name="amount"]');
    const accountField = transactionForm.querySelector('[name="account"]');
    const destinationField = transactionForm.querySelector('[name="destination"]');

    if (!amountField.value || Number(amountField.value) <= 0) {
      showTransactionNotice("Amount toh daalo! Khali pocket se withdrawal kaise karenge?");
      return;
    }
    if (!accountField.value) {
      showTransactionNotice("Kis account se? Paise ko teleport karne ka option abhi nahi aaya.");
      return;
    }
    if (!destinationField.value) {
      showTransactionNotice("Destination chuno! Paise ko aise hi bye-bye nahi bol sakte.");
      return;
    }
    if (!transactionForm.checkValidity()) {
      showTransactionNotice("Amount allowed range se bahar hai. Calculator ko overtime mat karao.");
      return;
    }

    const withdrawalFailures = [
      "Cash counter ka token machine lunch break par chala gaya.",
      "Manager ke signature ke liye manager ko dhoondha ja raha hai.",
      "ATM cash dene se pehle ek motivational speech maang raha hai.",
      "Bapu ki tijori ki chaabi phir se 'safe jagah' par rakh di gayi.",
      "Linked bank app update maang raha hai. Update ke baad phir update maang sakta hai.",
      "Withdrawal slip printer mein atki hai. Printer apni terms discuss kar raha hai.",
      "Cash machine 'processing' bolkar chai pe chali gayi.",
      "Transaction approval wali file manager ke desk ke neeche chhutti mana rahi hai.",
      "Cash counter par token khatam. Token machine ko bhi token chahiye.",
      "System ko aapke paise mil gaye, par abhi unse baat nahi ho pa rahi.",
    ];
    let withdrawalFailureIndex = Math.floor(Math.random() * withdrawalFailures.length);
    if (withdrawalFailureIndex === previousWithdrawalFailureIndex) {
      withdrawalFailureIndex = (withdrawalFailureIndex + 1 + Math.floor(Math.random() * (withdrawalFailures.length - 1))) % withdrawalFailures.length;
    }
    previousWithdrawalFailureIndex = withdrawalFailureIndex;
    showTransactionNotice(withdrawalFailures[withdrawalFailureIndex]);
    return;
  }

  if (action === "deposit") {
    const amountField = transactionForm.querySelector('[name="amount"]');
    const sourceField = transactionForm.querySelector('[name="source"]');
    const accountField = transactionForm.querySelector('[name="account"]');

    if (!amountField.value || Number(amountField.value) <= 0) {
      showTransactionNotice("Amount toh daalo! Hawa ko deposit karne ka option abhi launch nahi hua.");
      return;
    }
    if (!sourceField.value) {
      showTransactionNotice("Paise kahan se aa rahe? Officer ko bhi suspense pasand nahi.");
      return;
    }
    if (!accountField.value) {
      showTransactionNotice("Account toh chuno! Paise ko beech hawa mein latka ke rakhein kya?");
      return;
    }
    if (!transactionForm.checkValidity()) {
      showTransactionNotice("Amount allowed range se bahar hai. Calculator ko itna shock mat do.");
      return;
    }

    const failureReasons = [
      "Printer ne paper ke liye strike kar di.",
      "Lunch break chal rahi hai. Manager se permission le aao.",
      "Manager trip pe hain. Spare slips bhi unke saath ghoomne gayi hain.",
      "Officer ek working pen dhoondhne nikle hain. Bas milne hi wali hai.",
      "Slip printer Tuesday se warm-up kar raha hai.",
      "Deposit slips 'lunch ke baad' wale folder mein gayab hain.",
      "Coffee budget manager approve kar rahe hain. Ek aur meeting ke baad.",
      "Aakhri stamp ne bhi aaj chhutti le li.",
      "Stapler ne forms ko hostage bana liya hai.",
      "Printer update maang raha hai, password manager ke paas hai.",
      "Officer meeting mein hain: meetings kam kaise karein, is par meeting.",
      "Slip tray khaali hai. Paper airplane championship chal rahi thi.",
      "Ink pad retire ho gaya. Farewell party lunch ke baad hai.",
      "Manager office ki chaabi ghar le gaye. Ghar kaunsa hai, abhi confirm ho raha.",
      "Request form apne approval form ka wait kar raha hai.",
      "Counter khula hai, par sirf dramatic effect ke liye.",
      "Office clock ke hisaab se phir se lunch time ho gaya.",
      "Slips naam se nahi, mood ke hisaab se file ki gayi hain.",
      "Officer manager ko poochhne gaye. Manager officer ko poochhne nikal gaye.",
      "Printer soch raha hai. Print kab karega, yeh secret hai.",
      "Forms safe hain. Safe kis drawer mein hai, yeh mystery hai.",
      "Manager printer helpline par hold music enjoy kar rahe hain.",
      "Paper clips aur office ka morale, dono out of stock hain.",
      "Slip fax se bheji hai. Fax machine ka location confidential hai.",
    ];
    let failureIndex = Math.floor(Math.random() * failureReasons.length);
    if (failureIndex === previousFailureIndex) {
      failureIndex = (failureIndex + 1 + Math.floor(Math.random() * (failureReasons.length - 1))) % failureReasons.length;
    }
    previousFailureIndex = failureIndex;

    showTransactionNotice(failureReasons[failureIndex]);
    return;
  }

  if (!transactionForm.reportValidity()) return;

  const amount = Number(new FormData(transactionForm).get("amount"));
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

  formFeedback.textContent = `Preview ready: ${formattedAmount} ka ${action === "withdrawal" ? "withdrawal" : "deposit"} review ke liye taiyaar hai. Koi transaction submit nahi hui; paise safe hain.`;
});

if (errorDialog) {
  errorDialog.querySelectorAll(".slip-error-close, .slip-error-dismiss").forEach((button) => {
    button.addEventListener("click", () => errorDialog.close());
  });

  errorDialog.addEventListener("click", (event) => {
    if (event.target === errorDialog) errorDialog.close();
  });
}