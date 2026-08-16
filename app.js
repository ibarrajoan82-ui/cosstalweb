(() => {
  const splash = document.querySelector(".splash");
  try {
    if (sessionStorage.getItem("cosstal-intro")) {
      splash?.remove();
    } else {
      document.body.classList.add("intro-lock");
      window.setTimeout(() => {
        splash?.remove();
        sessionStorage.setItem("cosstal-intro", "1");
        document.body.classList.remove("intro-lock");
      }, 2900);
    }
  } catch {
    window.setTimeout(() => {
      splash?.remove();
      document.body.classList.remove("intro-lock");
    }, 2900);
  }

  const phone = "593958807188";
  const whatsapp = (message) => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const clean = (value) => value.replace(/[<>`{}\\]/g, "").replace(/\s+/g, " ").trim().slice(0, 180);

  const menuButton = document.querySelector(".menu-button");
  const navLinks = document.querySelector(".nav-links");
  menuButton?.addEventListener("click", () => {
    const open = navLinks?.classList.toggle("is-open") || false;
    menuButton.setAttribute("aria-expanded", String(open));
  });
  navLinks?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => navLinks.classList.remove("is-open")));

  const themeButton = document.querySelector('[aria-label="Cambiar tema"]');
  themeButton?.addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme === "dark";
    document.documentElement.dataset.theme = dark ? "light" : "dark";
    themeButton.textContent = dark ? "◐" : "☼";
  });

  const reveal = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: .12 });
  document.querySelectorAll("[data-reveal]").forEach((node) => reveal.observe(node));

  const cursor = document.querySelector(".cursor");
  window.addEventListener("mousemove", (event) => {
    if (cursor) cursor.style.transform = `translate3d(${event.clientX - 9}px, ${event.clientY - 9}px, 0)`;
  }, { passive: true });
  window.addEventListener("mouseover", (event) => cursor?.classList.toggle("cursor--active", Boolean(event.target.closest("a, button, input, select"))), { passive: true });

  const templateData = {
    "Comida rápida": ["burger.webp", "BURGER CLUB", "Hola, me interesa la plantilla de Comida Rápida."],
    "Ropa": ["fashion.webp", "NUEVA COLECCIÓN", "Hola, me interesa la plantilla de Ropa."],
    "Empresas": ["business.webp", "IMPULSA TU NEGOCIO", "Hola, me interesa la plantilla de Empresas."],
    "Postres": ["dessert.webp", "HECHO CON AMOR", "Hola, me interesa la plantilla de Postres."],
    "Heladería": ["template-heladeria.webp", "TU SABOR FAVORITO", "Hola, me interesa la plantilla de Heladería."]
  };

  const closeModal = () => document.querySelector(".modal-backdrop")?.remove();
  document.querySelectorAll(".template-actions button").forEach((button) => button.addEventListener("click", () => {
    const card = button.closest(".template-card");
    const label = card?.querySelector(".template-info h3")?.textContent?.trim() || "Plantilla";
    const [image, headline, message] = templateData[label] || templateData["Empresas"];
    document.body.insertAdjacentHTML("beforeend", `<div class="modal-backdrop" role="dialog" aria-modal="true"><div class="modal glass"><div class="modal-head"><div><small>VISTA INTERACTIVA</small><h2>${label}</h2></div><button class="modal-close" aria-label="Cerrar">×</button></div><div class="demo-frame demo-frame--desktop"><div class="demo-site" style="background-image:linear-gradient(90deg,rgba(0,0,0,.65),rgba(0,0,0,.08)),url('${image}');background-size:cover;background-position:center"><nav style="color:#fff"><b>${label}.</b><span>Inicio &nbsp; Menú &nbsp; Contacto</span></nav><main style="color:#fff"><small>SANTO DOMINGO · ECUADOR</small><h3><span>${headline}</span></h3><p>Una experiencia creada para atraer y convertir.</p></main></div></div><div class="modal-foot"><span>El diseño final se personaliza con tu marca y contenido.</span><a class="button button--primary" href="${whatsapp(message)}" target="_blank" rel="noopener noreferrer">Quiero esta dirección ↗</a></div></div></div>`);
    document.querySelector(".modal-close")?.addEventListener("click", closeModal);
    document.querySelector(".modal-backdrop")?.addEventListener("click", (event) => event.target.classList.contains("modal-backdrop") && closeModal());
  }));

  const quoteCard = document.querySelector(".quote-card");
  const quote = { business: "Restaurante o cafetería", goal: "Recibir pedidos", extras: [] };
  const choices = (items, selected, multiple = false) => items.map((item) => `<button class="choice ${multiple ? (selected.includes(item) ? "active" : "") : (selected === item ? "active" : "")}" data-value="${item}"><span>${item}</span><i>✓</i></button>`).join("");
  const renderQuote = (step = 1) => {
    if (!quoteCard) return;
    quoteCard.innerHTML = `<div class="stepper"><span class="active">1</span><i></i><span class="${step >= 2 ? "active" : ""}">2</span><i></i><span class="${step >= 3 ? "active" : ""}">3</span></div>` + (step === 1 ? `<div class="quote-panel"><small>PASO 1 DE 3</small><h3>¿Qué tipo de negocio tienes?</h3>${choices(["Restaurante o cafetería","Tienda o catálogo","Servicios profesionales","Otro negocio local"], quote.business)}<button class="button button--primary quote-next" data-next="2">Continuar →</button></div>` : step === 2 ? `<div class="quote-panel"><small>PASO 2 DE 3</small><h3>¿Cuál es tu objetivo principal?</h3>${choices(["Recibir pedidos","Conseguir más clientes","Mostrar mis servicios","Agendar citas"], quote.goal)}<div class="quote-row"><button class="text-button" data-next="1">← Volver</button><button class="button button--primary" data-next="3">Continuar →</button></div></div>` : `<div class="quote-panel"><small>PASO 3 DE 3</small><h3>¿Qué quieres conectar?</h3>${choices(["WhatsApp Business","Google Maps","Instagram","Pagos locales"], quote.extras, true)}<div class="quote-row"><button class="text-button" data-next="2">← Volver</button><a class="button button--primary" href="${whatsapp(`Hola CosstalWeb, quiero una cotización para mi negocio. Tipo: ${quote.business}. Objetivo: ${quote.goal}. Integraciones: ${quote.extras.length ? quote.extras.join(", ") : "Por definir"}.`)}" target="_blank" rel="noopener noreferrer">Enviar por WhatsApp ↗</a></div></div>`);
    quoteCard.querySelectorAll("[data-next]").forEach((button) => button.addEventListener("click", () => renderQuote(Number(button.dataset.next))));
    quoteCard.querySelectorAll(".choice").forEach((button) => button.addEventListener("click", () => {
      const value = button.dataset.value;
      if (step === 1) quote.business = value;
      else if (step === 2) quote.goal = value;
      else quote.extras = quote.extras.includes(value) ? quote.extras.filter((item) => item !== value) : [...quote.extras, value];
      renderQuote(step);
    }));
  };
  renderQuote(1);

  document.querySelector(".booking-card")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const inputs = [...event.currentTarget.querySelectorAll("input, select")].map((node) => clean(node.value));
    window.open(whatsapp(`Hola CosstalWeb, quiero agendar una asesoría. Soy ${inputs[0]}, mi negocio es ${inputs[1]} y prefiero ${inputs[2]}.`), "_blank", "noopener,noreferrer");
  });

  const privacyButton = [...document.querySelectorAll("footer button")].find((button) => button.textContent.includes("privacidad"));
  privacyButton?.addEventListener("click", () => {
    document.body.insertAdjacentHTML("beforeend", `<div class="modal-backdrop" role="dialog" aria-modal="true"><div class="modal privacy-modal glass"><button class="modal-close" aria-label="Cerrar">×</button><span class="section-index">PRIVACIDAD</span><h2>Tu información se queda contigo.</h2><p>CosstalWeb utiliza los datos que compartes únicamente para responder consultas, preparar propuestas y coordinar servicios. No vendemos ni cedemos información personal.</p><p>Los formularios abren WhatsApp en tu dispositivo; este sitio no almacena sus contenidos.</p></div></div>`);
    document.querySelector(".modal-close")?.addEventListener("click", closeModal);
  });
})();
