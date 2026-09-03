const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const toast = document.querySelector(".toast");
const form = document.querySelector("#signup-form");
const modal = document.querySelector("#detail-modal");
const modalTitle = document.querySelector("#modal-title");

let toastTimer;

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// Menu mobile
menuToggle?.addEventListener("click", () => {
  if (!mainNav) return;

  const isOpen = mainNav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Fechar menu" : "Abrir menu"
  );
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");

    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menu");
  });
});

// WhatsApp
document.querySelectorAll(".js-whatsapp").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    showToast(
      "Insira o número oficial do WhatsApp na próxima etapa."
    );
  });
});

// Seleção de evento
document.querySelectorAll("[data-event]").forEach((link) => {
  link.addEventListener("click", () => {
    const eventSelect = document.querySelector("#event");

    if (!eventSelect) return;

    const eventName = link.dataset.event || "";

    const option = [...eventSelect.options].find((item) =>
      item.textContent.trim().startsWith(eventName)
    );

    if (option) {
      eventSelect.value = option.value;
    }
  });
});

// Erros do formulário
function setFieldError(fieldId, message) {
  const field = document.querySelector(`#${fieldId}`);
  const error = document.querySelector(`#${fieldId}-error`);
  const wrapper = field?.closest(".field");

  if (!field || !error) return;

  error.textContent = message;

  wrapper?.classList.toggle(
    "invalid",
    Boolean(message)
  );

  field.setAttribute(
    "aria-invalid",
    String(Boolean(message))
  );
}

// Formulário
form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = form.elements.namedItem("name");
  const email = form.elements.namedItem("email");
  const phone = form.elements.namedItem("phone");
  const eventSelect = form.elements.namedItem("event");
  const consent = form.elements.namedItem("consent");

  const feedback = document.querySelector("#form-feedback");
  const consentError = document.querySelector("#consent-error");

  let valid = true;

  setFieldError("name", "");
  setFieldError("email", "");
  setFieldError("phone", "");
  setFieldError("event", "");

  if (consentError) {
    consentError.textContent = "";
  }

  if (feedback) {
    feedback.textContent = "";
  }

  // Nome
  if (!name || name.value.trim().length < 3) {
    setFieldError(
      "name",
      "Informe seu nome completo."
    );

    valid = false;
  }

  // E-mail
  if (!email || !email.validity.valid) {
    setFieldError(
      "email",
      "Informe um e-mail válido."
    );

    valid = false;
  }

  // Telefone
  if (
    !phone ||
    phone.value.replace(/\D/g, "").length < 10
  ) {
    setFieldError(
      "phone",
      "Informe um telefone válido."
    );

    valid = false;
  }

  // Evento
  if (!eventSelect || !eventSelect.value) {
    setFieldError(
      "event",
      "Selecione um evento."
    );

    valid = false;
  }

  // Consentimento
  if (!consent?.checked) {
    if (consentError) {
      consentError.textContent =
        "É necessário autorizar o recebimento de novidades.";
    }

    valid = false;
  }

  // Formulário inválido
  if (!valid) {
    form
      .querySelector("[aria-invalid='true']")
      ?.focus();

    return;
  }

  // Sucesso
  if (feedback) {
    feedback.textContent =
      "Cadastro demonstrativo realizado. Obrigado por fazer parte da Brasil Raiz!";
  }

  form.reset();

  form
    .querySelectorAll("[aria-invalid='true']")
    .forEach((field) => {
      field.setAttribute(
        "aria-invalid",
        "false"
      );
    });
});

// Modal
function closeModal() {
  if (!modal) return;

  modal.hidden = true;

  document.body.classList.remove(
    "modal-open"
  );
}

// Abrir modal da galeria
document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    if (!modal || !modalTitle) return;

    modalTitle.textContent =
      item.dataset.title || "Evento realizado";

    modal.hidden = false;

    document.body.classList.add(
      "modal-open"
    );

    document
      .querySelector(".modal-close")
      ?.focus();
  });
});

// Fechar modal pelo botão
document
  .querySelector(".modal-close")
  ?.addEventListener("click", closeModal);

// Fechar modal clicando fora
modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Fechar modal com ESC
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    modal &&
    !modal.hidden
  ) {
    closeModal();
  }
});

// Animações de entrada
const revealObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(
                "visible"
              );

              observer.unobserve(
                entry.target
              );
            }
          });
        },
        {
          threshold: 0.12
        }
      )
    : null;

// Aplicar animações
document
  .querySelectorAll(".reveal")
  .forEach((element) => {
    if (revealObserver) {
      revealObserver.observe(element);
    } else {
      element.classList.add("visible");
    }
  });