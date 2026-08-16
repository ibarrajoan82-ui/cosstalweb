(() => {
  const splash = document.querySelector(".splash");
  document.body.classList.add("intro-lock");
  window.setTimeout(() => {
    splash?.remove();
    document.body.classList.remove("intro-lock");
  }, 2900);

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

  const marketplace = document.querySelector(".marketplace-layout");
  const filterPanel = document.querySelector(".filter-panel");
  const filterToggle = document.querySelector(".filter-toggle");
  const templateGrid = document.querySelector(".marketplace-grid");
  const resultCount = document.querySelector(".marketplace-count");
  const sortControl = document.querySelector(".template-sort");
  const clearFilters = document.querySelector(".clear-filters");
  const allCards = templateGrid ? [...templateGrid.querySelectorAll(".marketplace-card")] : [];

  const selectedValues = (type) => [...document.querySelectorAll(`[data-filter-type="${type}"]:checked`)].map((input) => input.value);
  const updateMarketplace = () => {
    if (!templateGrid) return;
    const categories = selectedValues("category");
    const features = selectedValues("feature");
    const sort = sortControl?.value || "popular";
    const visible = allCards.filter((card) => {
      const cardFeatures = (card.dataset.features || "").split("|");
      return (!categories.length || categories.includes(card.dataset.category)) && (!features.length || features.every((feature) => cardFeatures.includes(feature)));
    });
    visible.sort((a, b) => {
      if (sort === "priority") return Number(b.dataset.priority) - Number(a.dataset.priority);
      if (sort === "recent") return String(b.dataset.created).localeCompare(String(a.dataset.created));
      if (sort === "name") return a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent, "es");
      return Number(b.dataset.popular) - Number(a.dataset.popular) || Number(b.dataset.priority) - Number(a.dataset.priority);
    });
    allCards.forEach((card) => {
      const isVisible = visible.includes(card);
      card.hidden = !isVisible;
      card.style.display = isVisible ? "" : "none";
    });
    visible.forEach((card) => templateGrid.appendChild(card));
    templateGrid.querySelector(".empty-results")?.remove();
    if (!visible.length) templateGrid.insertAdjacentHTML("beforeend", '<div class="empty-results glass"><span>⌕</span><h3>No encontramos una coincidencia</h3><p>Prueba quitando una característica o limpia los filtros para ver todos los diseños.</p><button type="button" class="empty-clear">Ver todas las plantillas</button></div>');
    if (resultCount) resultCount.textContent = `${visible.length} ${visible.length === 1 ? "diseño" : "diseños"}`;
    if (clearFilters) clearFilters.disabled = !(categories.length + features.length);
  };
  document.querySelectorAll("[data-filter-type]").forEach((input) => input.addEventListener("change", updateMarketplace));
  sortControl?.addEventListener("change", updateMarketplace);
  filterToggle?.addEventListener("click", () => {
    const isOpen = !filterPanel?.hidden;
    if (filterPanel) filterPanel.hidden = isOpen;
    marketplace?.classList.toggle("filters-hidden", isOpen);
    marketplace?.classList.toggle("filters-visible", !isOpen);
    filterToggle.setAttribute("aria-expanded", String(!isOpen));
    filterToggle.innerHTML = `<span aria-hidden="true">☷</span>${isOpen ? "Mostrar filtros" : "Ocultar filtros"}`;
  });
  const resetMarketplace = () => {
    document.querySelectorAll("[data-filter-type]").forEach((input) => { input.checked = false; });
    updateMarketplace();
  };
  clearFilters?.addEventListener("click", resetMarketplace);
  templateGrid?.addEventListener("click", (event) => { if (event.target.closest(".empty-clear")) resetMarketplace(); });
  document.querySelectorAll("[data-category-shortcut]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll('[data-filter-type="category"]').forEach((input) => { input.checked = input.value === button.dataset.categoryShortcut; });
    updateMarketplace();
    document.querySelector("#seccion-plantillas")?.scrollIntoView({ behavior: "smooth" });
  }));

  const previewData = {
    "burger-club": { label:"Burger Club", category:"Comida Rápida", theme:"theme-fastfood", screen:"BURGER|CLUB", kicker:"Menú que abre el apetito", detail:"Combos, menú visual y pedidos directos", features:["Slider de combos","Pedido en un toque","Promociones programables","Mapa del local"], badges:["100% Responsivo","Menú Digital","Pedidos a WhatsApp","Animaciones Interactivas"], gallery:[["https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1100&q=82","Menú de hamburguesas"],["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1100&q=82","Combos destacados"],["https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=1100&q=82","Reseñas del local"],["https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1100&q=82","Pedido por WhatsApp"]] },
    "studio-norte": { label:"Studio Norte", category:"Ropa / Moda", theme:"theme-fashion", screen:"NUEVA|COLECCIÓN", kicker:"Colecciones con presencia", detail:"Colecciones, tallas y consultas por WhatsApp", features:["Cuadrícula editorial","Selector de tallas","Zoom de prendas","Lookbook de temporada"], badges:["100% Responsivo","Pedidos a WhatsApp","Animaciones Interactivas"], gallery:[["https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1100&q=82","Colección editorial"],["https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=82","Catálogo asimétrico"],["https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1100&q=82","Detalle de producto"],["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=82","Selector de tallas"]] },
    "impulsa-pro": { label:"Impulsa Pro", category:"Empresas / Servicios", theme:"theme-corporate", screen:"IMPULSA|TU NEGOCIO", kicker:"Confianza desde el inicio", detail:"Servicios, equipo y contacto profesional", features:["Gráficos de resultados","Cotizador guiado","Casos de éxito","Formulario inteligente"], badges:["100% Responsivo","Animaciones Interactivas"], gallery:[["https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1100&q=82","Servicios corporativos"],["https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1100&q=82","Sobre el equipo"],["https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1100&q=82","Casos de éxito"],["https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1100&q=82","Formulario de cotización"]] },
    "dulce-alma": { label:"Dulce Alma", category:"Postres / Heladería", theme:"theme-dessert", screen:"HECHO|CON AMOR", kicker:"Dulce, visual y memorable", detail:"Sabores, encargos y entregas locales", features:["Vitrina interactiva","Pedidos personalizados","Calendario de encargos","Galería pastel"], badges:["100% Responsivo","Menú Digital","Pedidos a WhatsApp"], gallery:[["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1100&q=82","Vitrina de pasteles"],["https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1100&q=82","Menú de postres"],["https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1100&q=82","Pedidos especiales"],["https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1100&q=82","Contacto y entregas"]] },
    "gelato-costa": { label:"Gelato Costa", category:"Postres / Heladería", theme:"theme-gelato", screen:"TU SABOR|FAVORITO", kicker:"Frescura en cada scroll", detail:"Sabores artesanales, promociones y mapa", features:["Sabores animados","Promoción del día","Mapa interactivo","Tarjetas coleccionables"], badges:["100% Responsivo","Menú Digital","Animaciones Interactivas"], gallery:[["https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=1100&q=82","Sabores artesanales"],["https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=1100&q=82","Carta de temporada"],["https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=1100&q=82","Promoción del día"],["https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&w=1100&q=82","Ubicación y contacto"]] },
    "verde-local": { label:"Verde Local", category:"Mercado / Productos Orgánicos", theme:"theme-organic", screen:"FRESCO|Y CERCA", kicker:"Del mercado a tu mesa", detail:"Productos orgánicos y entregas locales", features:["Filtros de productos","Origen del productor","Testimonios locales","Carrito por WhatsApp"], badges:["100% Responsivo","Menú Digital","Pedidos a WhatsApp"], gallery:[["https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1100&q=82","Catálogo de productos"],["https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1100&q=82","Filtros por categoría"],["https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1100&q=82","Origen y productores"],["https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1100&q=82","Testimonios y pedidos"]] }
  };
  const interactionFor = (theme) => ({
    "theme-fastfood": '<small>COMBOS FAVORITOS</small><div class="motion-cards"><i>01</i><i>02</i><i>03</i></div><b>Pide ahora →</b>',
    "theme-fashion": '<small>SELECCIONA TU TALLA</small><div class="size-picker"><i>XS</i><i>S</i><i>M</i><i>L</i></div><b>Nueva colección</b>',
    "theme-corporate": '<small>CRECIMIENTO DIGITAL</small><div class="metric-bars"><i></i><i></i><i></i><i></i></div><b>+68% conversiones</b>',
    "theme-dessert": '<small>VITRINA DEL DÍA</small><div class="sweet-dots"><i></i><i></i><i></i></div><b>Hecho por encargo</b>',
    "theme-gelato": '<small>SABOR DEL DÍA</small><div class="flavor-orbs"><i></i><i></i><i></i></div><b>Descubre sabores</b>',
    "theme-organic": '<small>FILTRAR PRODUCTOS</small><div class="organic-chips"><i>Frutas</i><i>Vegetales</i><i>Local</i></div><b>Del productor a ti</b>'
  })[theme];
  const closeModal = () => { document.querySelector(".modal-backdrop")?.remove(); document.body.classList.remove("modal-open"); };
  document.querySelectorAll(".template-actions button").forEach((button) => button.addEventListener("click", () => {
    const card = button.closest(".template-card");
    const data = previewData[card?.dataset.templateId];
    if (!data) return;
    const frames = data.gallery.map(([src,label],index) => `<img src="${src}" alt="" loading="lazy" style="animation-delay:${index * 2.4}s">`).join("");
    const gallery = data.gallery.map(([src,label],index) => `<button class="${index === 0 ? "active" : ""}" data-gallery="${index}" aria-label="Ver ${label}"><img src="${src}" alt="${label}" loading="lazy"><span>${label}</span><i>0${index + 1}</i></button>`).join("");
    const featureList = data.features.map((item) => `<li><span>✓</span>${item}</li>`).join("");
    const badges = data.badges.map((item) => `<span>${item}</span>`).join("");
    const headline = data.screen.split("|").map((line) => `<span>${line}</span>`).join("");
    document.body.classList.add("modal-open");
    document.body.insertAdjacentHTML("beforeend", `<div class="modal-backdrop preview-backdrop" role="dialog" aria-modal="true"><div class="modal preview-modal glass ${data.theme}"><div class="preview-modal-head"><div><small>VISTA PREVIA INTERACTIVA</small><h2>${data.label}</h2><span>${data.category}</span></div><button class="modal-close" aria-label="Cerrar vista previa">×</button></div><div class="preview-modal-grid"><section class="preview-stage"><div class="preview-stage-toolbar"><div><i class="live-dot"></i>RECORRIDO AUTOMÁTICO</div><div class="device-switch"><button class="active" data-device="desktop">▰ <span>Escritorio</span></button><button data-device="mobile">▯ <span>Móvil</span></button></div></div><div class="preview-device preview-device--desktop"><div class="preview-screen"><div class="preview-sequence">${frames}</div><div class="preview-tint"></div><nav class="preview-nav"><b>${data.label}</b><span>Inicio &nbsp; Colección &nbsp; Nosotros &nbsp; Contacto</span><i>☰</i></nav><div class="preview-hero"><small>SANTO DOMINGO · ECUADOR</small><h3>${headline}</h3><p>${data.kicker}</p><button>Descubrir ahora ↗</button></div><div class="preview-interaction">${interactionFor(data.theme)}</div></div></div><div class="playback-line"><span style="--playback:25%"></span><small>En reproducción: ${data.gallery[0][1]}</small></div></section><aside class="preview-details"><div class="preview-summary"><span class="preview-category">${data.category}</span><h3>${data.kicker}</h3><p>${data.detail}. Una dirección visual completamente personalizable para tu marca.</p></div><div class="preview-gallery-head"><h4>Recorrido por sus secciones</h4><span>4 capturas</span></div><div class="preview-gallery">${gallery}</div><div class="preview-features"><h4>Incluido en esta plantilla</h4><ul>${featureList}</ul><div>${badges}</div></div><a class="preview-cta" href="${whatsapp(`Hola CosstalWeb, quiero obtener la plantilla ${data.label} para mi negocio.`)}" target="_blank" rel="noopener noreferrer"><span>Obtener esta plantilla para mi negocio</span><span>↗</span></a></aside></div></div></div>`);
    const backdrop = document.querySelector(".preview-backdrop");
    backdrop?.querySelector(".modal-close")?.addEventListener("click", closeModal);
    backdrop?.addEventListener("click", (event) => event.target === backdrop && closeModal());
    backdrop?.querySelectorAll("[data-device]").forEach((control) => control.addEventListener("click", () => {
      backdrop.querySelectorAll("[data-device]").forEach((item) => item.classList.toggle("active", item === control));
      const device = backdrop.querySelector(".preview-device");
      device.className = `preview-device preview-device--${control.dataset.device}`;
    }));
    backdrop?.querySelectorAll("[data-gallery]").forEach((control) => control.addEventListener("click", () => {
      backdrop.querySelectorAll("[data-gallery]").forEach((item) => item.classList.toggle("active", item === control));
      const index = Number(control.dataset.gallery);
      backdrop.querySelector(".playback-line span").style.setProperty("--playback", `${(index + 1) * 25}%`);
      backdrop.querySelector(".playback-line small").textContent = `En reproducción: ${data.gallery[index][1]}`;
    }));
  }));
  window.addEventListener("keydown", (event) => event.key === "Escape" && closeModal());

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
