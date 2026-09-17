/*
 * Integrações: preencha estas constantes quando os dados oficiais estiverem disponíveis.
 * O formulário permanece em modo demonstração enquanto FORM_ENDPOINT estiver vazio.
 */
const WHATSAPP_URL = "";
const FORM_ENDPOINT = "";

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const toast = document.querySelector(".toast");
const form = document.querySelector("#signup-form");
const modal = document.querySelector("#detail-modal");
const modalTitle = document.querySelector("#modal-title");
const modalInfo = document.querySelector("#modal-info");
const modalDescription = document.querySelector("#modal-description");
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3500);
}

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menu");
  });
});

document.querySelectorAll(".js-whatsapp").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!WHATSAPP_URL) {
      event.preventDefault();
      showToast("Insira o link oficial do WhatsApp na próxima etapa.");
      return;
    }
    link.href = WHATSAPP_URL;
  });
});

const eventSelect = document.querySelector("#event");
document.querySelectorAll("[data-event]").forEach((link) => {
  link.addEventListener("click", () => {
    if (!eventSelect) return;
    const eventName = link.dataset.event;
    const option = [...eventSelect.options].find((item) => item.textContent.startsWith(eventName));
    if (option) eventSelect.value = option.value;
  });
});

function setFieldError(fieldId, message) {
  const field = document.querySelector(`#${fieldId}`);
  const error = document.querySelector(`#${fieldId}-error`);
  const wrapper = field?.closest(".field");
  if (!field || !error) return;
  error.textContent = message;
  wrapper?.classList.toggle("invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = form.elements.name;
  const email = form.elements.email;
  const phone = form.elements.phone;
  const selectedEvent = form.elements.event;
  const consent = form.elements.consent;
  const submitButton = form.querySelector("button[type='submit']");
  const feedback = document.querySelector("#form-feedback");
  let valid = true;

  setFieldError("name", "");
  setFieldError("email", "");
  setFieldError("phone", "");
  setFieldError("event", "");
  document.querySelector("#consent-error").textContent = "";
  consent.setAttribute("aria-invalid", "false");
  feedback.textContent = "";

  if (name.value.trim().length < 3) {
    setFieldError("name", "Informe seu nome completo.");
    valid = false;
  }
  if (!email.validity.valid) {
    setFieldError("email", "Informe um e-mail válido.");
    valid = false;
  }
  if (phone.value.replace(/\D/g, "").length < 10) {
    setFieldError("phone", "Informe um telefone válido.");
    valid = false;
  }
  if (!selectedEvent.value) {
    setFieldError("event", "Selecione um evento.");
    valid = false;
  }
  if (!consent.checked) {
    document.querySelector("#consent-error").textContent = "É necessário autorizar o recebimento de novidades.";
    consent.setAttribute("aria-invalid", "true");
    valid = false;
  }

  if (!valid) {
    form.querySelector("[aria-invalid='true']")?.focus();
    return;
  }

  const payload = {
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    event: selectedEvent.value,
    message: form.elements.message.value.trim(),
    consent: consent.checked,
  };

  if (!FORM_ENDPOINT) {
    feedback.textContent = "Cadastro demonstrativo realizado. Obrigado por fazer parte!";
    form.reset();
    return;
  }

  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");
  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Falha no envio");
    feedback.textContent = "Inscrição enviada com sucesso. Em breve falaremos com você!";
    form.reset();
  } catch {
    feedback.textContent = "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.";
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
  }
});

function openModal(title, info, description) {
  if (!modal) return;
  modalTitle.textContent = title;
  modalInfo.textContent = info || "Informações oficiais a confirmar";
  modalDescription.textContent = description || "Esta área receberá as informações oficiais quando forem confirmadas.";
  modal.hidden = false;
  document.body.classList.add("modal-open");
  document.querySelector(".modal-close")?.focus();
}

function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
}

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => openModal(item.dataset.title, "Evento realizado • detalhes a inserir", "Esta área receberá fotos, vídeos e a história completa do evento. O conteúdo oficial será adicionado quando for enviado."));
});

document.querySelectorAll(".event-details").forEach((item) => {
  item.addEventListener("click", () => openModal(item.dataset.detailTitle, item.dataset.detailInfo, item.dataset.detailDescription));
});

document.querySelector(".modal-close")?.addEventListener("click", closeModal);
document.querySelector("#modal-cta")?.addEventListener("click", closeModal);
modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && !modal.hidden) closeModal();
});

const countdown = document.querySelector("[data-countdown]");
if (countdown) {
  const targetDate = new Date(countdown.dataset.countdown).getTime();
  const units = ["days", "hours", "minutes", "seconds"];

  function updateCountdown() {
    const distance = Math.max(0, targetDate - Date.now());
    const values = [
      Math.floor(distance / 86400000),
      Math.floor((distance / 3600000) % 24),
      Math.floor((distance / 60000) % 60),
      Math.floor((distance / 1000) % 60),
    ];
    units.forEach((unit, index) => {
      const element = countdown.querySelector(`[data-unit="${unit}"]`);
      if (element) element.textContent = String(values[index]).padStart(2, "0");
    });
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

const archiveGrid = document.querySelector("#archive-grid");
const departmentFilter = document.querySelector("#department-filter");
const yearFilter = document.querySelector("#year-filter");
const archiveEmpty = document.querySelector("#archive-empty");

function filterArchive() {
  if (!archiveGrid || !departmentFilter || !yearFilter) return;
  const cards = [...archiveGrid.querySelectorAll(".archive-card")];
  const department = departmentFilter.value;
  const year = yearFilter.value;
  let visibleCards = 0;

  cards.forEach((card) => {
    const matchesDepartment = department === "all" || card.dataset.department === department;
    const matchesYear = year === "all" || card.dataset.year === year;
    card.hidden = !(matchesDepartment && matchesYear);
    if (!card.hidden) visibleCards += 1;
  });
  if (archiveEmpty) archiveEmpty.hidden = visibleCards > 0;
}

departmentFilter?.addEventListener("change", filterArchive);
yearFilter?.addEventListener("change", filterArchive);

const eventDetails = {
  "rh-integracao": {
    title: "Integração que aproxima",
    department: "RH",
    date: "Informação oficial a inserir",
    intro: "Um encontro para fortalecer vínculos e celebrar pessoas.",
    description: "Este é um conteúdo demonstrativo para o evento do RH. Aqui entrarão a história completa, a programação, as fotos e os resultados oficiais.",
    aside: "O RH poderá apresentar nesta página o objetivo do encontro, as pessoas envolvidas e os aprendizados construídos em conjunto.",
  },
  "ti-inovacao": {
    title: "Ideias em movimento",
    department: "TI",
    date: "Informação oficial a inserir",
    intro: "Inovação, colaboração e tecnologia em um só encontro.",
    description: "Este é um conteúdo demonstrativo para o evento de TI. Aqui entrarão a história completa, a programação, as fotos e os resultados oficiais.",
    aside: "A equipe de TI poderá registrar as soluções apresentadas, os projetos compartilhados e as conexões que nasceram deste encontro.",
  },
  "comunicacao-conexao": {
    title: "Conexões que comunicam",
    department: "Comunicação",
    date: "Informação oficial a inserir",
    intro: "Um espaço para trocar histórias, ideias e diferentes perspectivas.",
    description: "Este é um conteúdo demonstrativo para o evento de Comunicação. Aqui entrarão a história completa, a programação, as fotos e os resultados oficiais.",
    aside: "A Comunicação poderá contar como o encontro foi planejado, quais histórias foram compartilhadas e quais conversas continuaram depois.",
  },
  "eventos-encontro": {
    title: "Encontro em cada detalhe",
    department: "Eventos",
    date: "Informação oficial a inserir",
    intro: "Planejamento, acolhimento e presença para criar boas memórias.",
    description: "Este é um conteúdo demonstrativo para o evento de Eventos. Aqui entrarão a história completa, a programação, as fotos e os resultados oficiais.",
    aside: "O time de Eventos poderá mostrar os bastidores, o planejamento e as escolhas que fizeram este encontro acontecer.",
  },
  "marketing-experiencia": {
    title: "Marcas que se encontram",
    department: "Marketing",
    date: "Informação oficial a inserir",
    intro: "Uma experiência para aproximar ideias, pessoas e propósitos.",
    description: "Este é um conteúdo demonstrativo para o evento de Marketing. Aqui entrarão a história completa, a programação, as fotos e os resultados oficiais.",
    aside: "O Marketing poderá apresentar o propósito da ação, os públicos envolvidos e os resultados reais alcançados.",
  },
};

const eventKey = new URLSearchParams(window.location.search).get("evento");
const currentEvent = eventDetails[eventKey];
if (currentEvent && document.querySelector(".event-detail-page")) {
  document.title = `${currentEvent.title} | Brasil Raiz`;
  document.querySelector("#event-detail-title").textContent = currentEvent.title;
  document.querySelector("#event-detail-department").textContent = `${currentEvent.department} • Evento realizado`;
  document.querySelector("#event-detail-intro").textContent = currentEvent.intro;
  document.querySelector("#event-detail-description").textContent = currentEvent.description;
  document.querySelector("#event-detail-aside").textContent = currentEvent.aside;
  document.querySelector("#event-detail-date").textContent = currentEvent.date;
  document.querySelector("#event-detail-fact-department").textContent = currentEvent.department;
}

document.querySelector("#cookie-dismiss")?.addEventListener("click", () => {
  document.querySelector("#cookie-banner")?.classList.add("is-hidden");
});

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

document.querySelectorAll(".reveal").forEach((element) => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add("visible");
});