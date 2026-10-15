
document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. UTILIDADES
  // ==========================================

  const $ = id => document.getElementById(id);
  const root = document.documentElement;
  const body = document.body;

  const FAVORITES_KEY = "tesisLiveLibraryFavoritesV1";

  function icons() {
    window.lucide?.createIcons();
  }

  function makeIcon(name) {
    const element = document.createElement("i");
    element.setAttribute("data-lucide", name);
    return element;
  }

  function el(tag, className = "", text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function makeButton(text, iconName, className, callback) {
    const button = el("button", className);
    button.type = "button";

    if (iconName) button.append(makeIcon(iconName));
    if (text) button.append(document.createTextNode(text));

    button.addEventListener("click", callback);
    return button;
  }

  let toastTimer;

  function toast(message) {
    const node = $("libraryToast");
    node.textContent = message;
    node.hidden = false;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      node.hidden = true;
    }, 3500);
  }

  function normalize(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  // ==========================================
  // 2. APARIENCIA
  // ==========================================

  const savedTheme = localStorage.getItem("tesisLiveTheme");

  root.dataset.theme =
    ["light", "dark", "system"].includes(savedTheme)
      ? savedTheme
      : "system";

  // ==========================================
  // 3. NAVEGACIÓN
  // ==========================================

  const currentFile = location.pathname
    .split("/")
    .pop()
    .toLowerCase();

  const pages = {
    "dashboard.html": "inicio",
    "asesor-ia.html": "asesor-ia",
    "proyectos.html": "proyectos",
    "biblioteca.html": "biblioteca",
    "configuracion.html": "configuracion"
  };

  const activePage = pages[currentFile];

  document.querySelectorAll(".sidebar .nav-link[data-page]")
    .forEach(link => {
      const active = link.dataset.page === activePage;

      link.classList.toggle("active", active);

      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

  // ==========================================
  // 4. SIDEBAR
  // ==========================================

  const collapse = $("sidebarCollapse");
  const mobileMenu = $("mobileMenu");

  body.classList.toggle(
    "sidebar-collapsed",
    localStorage.getItem("tesisLiveSidebar") === "collapsed"
  );

  function updateCollapse() {
    const collapsed = body.classList.contains("sidebar-collapsed");

    collapse.setAttribute(
      "aria-label",
      collapsed ? "Expandir menú" : "Contraer menú"
    );

    collapse.title = collapsed
      ? "Expandir menú"
      : "Contraer menú";
  }

  updateCollapse();

  collapse.addEventListener("click", () => {
    body.classList.toggle("sidebar-collapsed");

    const collapsed = body.classList.contains("sidebar-collapsed");

    localStorage.setItem(
      "tesisLiveSidebar",
      collapsed ? "collapsed" : "expanded"
    );

    updateCollapse();
  });

  function closeMobileMenu() {
    body.classList.remove("mobile-sidebar-open");
    mobileMenu.setAttribute("aria-expanded", "false");
  }

  mobileMenu.addEventListener("click", () => {
    const opened = body.classList.toggle("mobile-sidebar-open");
    mobileMenu.setAttribute("aria-expanded", String(opened));
  });

  $("sidebarOverlay").addEventListener("click", closeMobileMenu);

  window.matchMedia("(max-width: 850px)")
    .addEventListener("change", closeMobileMenu);

  // ==========================================
  // 5. NOTIFICACIONES
  // ==========================================

  const notificationButton = $("notificationButton");
  const notificationPopover = $("notificationPopover");

  function closeNotifications() {
    notificationPopover.hidden = true;
    notificationButton.setAttribute("aria-expanded", "false");
  }

  notificationButton.addEventListener("click", event => {
    event.stopPropagation();

    const opened = notificationPopover.hidden;
    notificationPopover.hidden = !opened;

    notificationButton.setAttribute(
      "aria-expanded",
      String(opened)
    );
  });

  document.addEventListener("click", event => {
    if (
      !notificationPopover.contains(event.target) &&
      !notificationButton.contains(event.target)
    ) {
      closeNotifications();
    }
  });

  // ==========================================
  // 6. CATÁLOGO DEMOSTRATIVO
  // ==========================================
  //
  // Todas las investigaciones que aparecen aquí
  // son ficticias y solo sirven para probar
  // el diseño de la plataforma.
  //
  // Cuando integremos el catálogo real:
  // - verificaremos autores e instituciones
  // - guardaremos enlaces oficiales
  // - utilizaremos DOI/URI válidos
  // - generaremos referencias verificables

  const catalog = [
    {
      id: "inv-01",
      group: "investigaciones",
      type: "tesis",
      title: "Impacto del marketing digital en las PYMES",
      author: "María Pérez",
      year: 2024,
      institution: "Universidad de ejemplo A",
      level: "Pregrado",
      format: "PDF",
      icon: "graduation-cap",
      description: "Investigación ilustrativa sobre estrategias de marketing digital y su relación con el crecimiento empresarial de pequeñas y medianas empresas.",
      keywords: ["Marketing digital", "PYMES", "Empresas"],
      url: null,
      verified: false
    },
    {
      id: "inv-02",
      group: "investigaciones",
      type: "tesis",
      title: "Satisfacción estudiantil en entornos universitarios",
      author: "Carlos Ramos",
      year: 2023,
      institution: "Universidad de ejemplo B",
      level: "Pregrado",
      format: "PDF",
      icon: "graduation-cap",
      description: "Ejemplo académico sobre factores asociados con la satisfacción y la experiencia educativa de estudiantes universitarios.",
      keywords: ["Educación", "Satisfacción", "Universidad"],
      url: null,
      verified: false
    },
    {
      id: "inv-03",
      group: "investigaciones",
      type: "articulo",
      title: "Inteligencia artificial y aprendizaje universitario",
      author: "Lucía Torres",
      year: 2025,
      institution: "Instituto académico de ejemplo",
      level: "Artículo científico",
      format: "ENLACE",
      icon: "file-search",
      description: "Artículo ficticio que explora oportunidades y desafíos del uso de herramientas de inteligencia artificial en la educación superior.",
      keywords: ["Inteligencia artificial", "Aprendizaje", "Educación"],
      url: null,
      verified: false
    },
    {
      id: "inv-04",
      group: "investigaciones",
      type: "tesis",
      title: "Estrategias de branding personal en redes sociales",
      author: "Andrea Salazar",
      year: 2022,
      institution: "Universidad de ejemplo A",
      level: "Pregrado",
      format: "PDF",
      icon: "graduation-cap",
      description: "Tesis demostrativa sobre posicionamiento de marca personal y comunicación en plataformas digitales.",
      keywords: ["Branding", "Redes sociales", "Comunicación"],
      url: null,
      verified: false
    },
    {
      id: "inv-05",
      group: "investigaciones",
      type: "paper",
      title: "Herramientas digitales para la investigación académica",
      author: "Daniel Flores",
      year: 2026,
      institution: "Centro de investigación de ejemplo",
      level: "Paper",
      format: "ENLACE",
      icon: "book-open-check",
      description: "Documento ilustrativo acerca de herramientas tecnológicas para buscar, organizar y analizar información académica.",
      keywords: ["Investigación", "Tecnología", "Herramientas"],
      url: null,
      verified: false
    },
    {
      id: "inv-06",
      group: "investigaciones",
      type: "tesis",
      title: "Gestión de recursos y sostenibilidad empresarial",
      author: "Sofía Mendoza",
      year: 2021,
      institution: "Universidad de ejemplo C",
      level: "Posgrado",
      format: "PDF",
      icon: "graduation-cap",
      description: "Investigación ficticia sobre gestión responsable de recursos y prácticas sostenibles en organizaciones.",
      keywords: ["Sostenibilidad", "Gestión", "Empresas"],
      url: null,
      verified: false
    },

    // RECURSOS DE APRENDIZAJE

    {
      id: "rec-01",
      group: "recursos",
      type: "guia",
      title: "Guía para estructurar una tesis",
      author: "Equipo académico de ejemplo",
      year: 2026,
      institution: "Material demostrativo TesisLive",
      level: "Guía metodológica",
      format: "PDF",
      icon: "book-open",
      description: "Descripción de ejemplo sobre las secciones habituales de una tesis y recomendaciones para organizarlas.",
      keywords: ["Tesis", "Estructura", "Metodología"],
      url: null,
      verified: false
    },
    {
      id: "rec-02",
      group: "recursos",
      type: "plantilla",
      title: "Plantilla de matriz de consistencia",
      author: "Equipo académico de ejemplo",
      year: 2026,
      institution: "Material demostrativo TesisLive",
      level: "Plantilla editable",
      format: "DOCX",
      icon: "file-pen-line",
      description: "Modelo ilustrativo para relacionar problemas, objetivos, hipótesis y variables de investigación.",
      keywords: ["Matriz", "Objetivos", "Variables"],
      url: null,
      verified: false
    },
    {
      id: "rec-03",
      group: "recursos",
      type: "norma",
      title: "Guía práctica de referencias APA 7",
      author: "Equipo académico de ejemplo",
      year: 2026,
      institution: "Material demostrativo TesisLive",
      level: "Guía de citación",
      format: "PDF",
      icon: "book-marked",
      description: "Ficha ilustrativa sobre la organización de referencias y citas dentro del texto siguiendo APA 7.",
      keywords: ["APA", "Citas", "Referencias"],
      url: null,
      verified: false
    },
    {
      id: "rec-04",
      group: "recursos",
      type: "guia",
      title: "Cómo formular objetivos de investigación",
      author: "Equipo académico de ejemplo",
      year: 2025,
      institution: "Material demostrativo TesisLive",
      level: "Guía metodológica",
      format: "PDF",
      icon: "target",
      description: "Material demostrativo sobre claridad, delimitación y coherencia entre objetivos y problemas de investigación.",
      keywords: ["Objetivos", "Problema", "Investigación"],
      url: null,
      verified: false
    },
    {
      id: "rec-05",
      group: "recursos",
      type: "plantilla",
      title: "Plantilla de cronograma de tesis",
      author: "Equipo académico de ejemplo",
      year: 2026,
      institution: "Material demostrativo TesisLive",
      level: "Plantilla editable",
      format: "DOCX",
      icon: "calendar-range",
      description: "Formato ilustrativo para organizar actividades, entregables y fechas de una investigación.",
      keywords: ["Cronograma", "Organización", "Tesis"],
      url: null,
      verified: false
    },
    {
      id: "rec-06",
      group: "recursos",
      type: "guia",
      title: "Cómo elaborar antecedentes académicos",
      author: "Equipo académico de ejemplo",
      year: 2025,
      institution: "Material demostrativo TesisLive",
      level: "Guía metodológica",
      format: "PDF",
      icon: "library-big",
      description: "Orientación ilustrativa para comparar estudios existentes y comprender su relación con el problema de investigación.",
      keywords: ["Antecedentes", "Fuentes", "Literatura"],
      url: null,
      verified: false
    }
  ];

  // ==========================================
  // 7. FAVORITOS
  // ==========================================

  function loadFavorites() {
    try {
      const data = JSON.parse(
        localStorage.getItem(FAVORITES_KEY) || "[]"
      );

      return new Set(Array.isArray(data) ? data : []);
    } catch {
      return new Set();
    }
  }

  const favorites = loadFavorites();

  function saveFavorites() {
    try {
      localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify([...favorites])
      );
    } catch {
      toast("No se pudieron guardar los favoritos.");
    }
  }

  function toggleFavorite(id) {
    if (favorites.has(id)) {
      favorites.delete(id);
      toast("Recurso retirado de guardados.");
    } else {
      favorites.add(id);
      toast("Recurso guardado en tu biblioteca.");
    }

    saveFavorites();
    renderCatalog();

    if (selectedResourceId === id) {
      updateModalFavorite();
    }
  }

  // ==========================================
  // 8. ESTADO DE LA BIBLIOTECA
  // ==========================================

  const validTabs = [
    "investigaciones",
    "recursos",
    "guardados"
  ];

  let activeTab = "investigaciones";
  let selectedResourceId = null;
  let previousFocus = null;

  const sectionInfo = {
    investigaciones: {
      title: "Investigaciones académicas",
      description: "Consulta tesis, artículos y papers para conocer antecedentes y metodologías."
    },
    recursos: {
      title: "Recursos de aprendizaje",
      description: "Encuentra guías metodológicas, plantillas y materiales académicos."
    },
    guardados: {
      title: "Tu biblioteca personal",
      description: "Accede rápidamente a las investigaciones y recursos que guardaste."
    }
  };

  // ==========================================
  // 9. PESTAÑAS
  // ==========================================

  function selectTab(tab, updateUrl = true) {
    if (!validTabs.includes(tab)) {
      tab = "investigaciones";
    }

    activeTab = tab;

    document.querySelectorAll(".library-tab")
      .forEach(button => {
        const active = button.dataset.tab === tab;

        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
      });

    $("libraryResults").setAttribute(
      "aria-labelledby",
      `tab-${tab}`
    );

    $("resultsTitle").textContent = sectionInfo[tab].title;
    $("resultsDescription").textContent =
      sectionInfo[tab].description;

    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set("tab", tab);
      history.replaceState(null, "", url);
    }

    renderCatalog();
  }

  document.querySelectorAll(".library-tab")
    .forEach(button => {

      button.addEventListener("click", () => {
        selectTab(button.dataset.tab);
      });

      button.addEventListener("keydown", event => {
        if (![
          "ArrowLeft", "ArrowRight", "Home", "End"
        ].includes(event.key)) return;

        event.preventDefault();

        const current = validTabs.indexOf(button.dataset.tab);
        let next = current;

        if (event.key === "ArrowRight") {
          next = (current + 1) % validTabs.length;
        }

        if (event.key === "ArrowLeft") {
          next = (current + validTabs.length - 1) % validTabs.length;
        }

        if (event.key === "Home") next = 0;
        if (event.key === "End") next = validTabs.length - 1;

        selectTab(validTabs[next]);
        $(`tab-${validTabs[next]}`).focus();
      });
    });

  // ==========================================
  // 10. FILTROS
  // ==========================================

  function populateFilters() {
    const years = [...new Set(catalog.map(r => r.year))]
      .sort((a, b) => b - a);

    const institutions = [...new Set(
      catalog.map(r => r.institution)
    )].sort((a, b) => a.localeCompare(b, "es"));

    years.forEach(year => {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = year;
      $("filterYear").append(option);
    });

    institutions.forEach(institution => {
      const option = document.createElement("option");
      option.value = institution;
      option.textContent = institution;
      $("filterInstitution").append(option);
    });
  }

  $("toggleFilters").addEventListener("click", () => {
    const willOpen = $("advancedFilters").hidden;

    $("advancedFilters").hidden = !willOpen;
    $("toggleFilters").setAttribute(
      "aria-expanded",
      String(willOpen)
    );
  });

  function resetFilters() {
    $("librarySearch").value = "";
    $("filterType").value = "todos";
    $("filterYear").value = "todos";
    $("filterInstitution").value = "todos";
    $("filterFormat").value = "todos";
    $("sortResults").value = "recientes";

    renderCatalog();

    sortSelected.textContent = "Más recientes";

sortOptions.forEach(option => {
  const selected = option.dataset.value === "recientes";
  option.classList.toggle("active", selected);
  option.setAttribute("aria-selected", String(selected));
});

closeSortMenu();
  }

  
// ==========================================
// DROPDOWN PERSONALIZADO: ORDENAR
// ==========================================

const sortDropdown = $("sortDropdown");
const sortTrigger = $("sortTrigger");
const sortMenu = $("sortMenu");
const sortSelected = $("sortSelected");
const sortOptions = [...document.querySelectorAll(".sort-option")];

function closeSortMenu(restoreFocus = false) {
  sortMenu.hidden = true;
  sortTrigger.setAttribute("aria-expanded", "false");

  if (restoreFocus) sortTrigger.focus();
}

function openSortMenu() {
  sortMenu.hidden = false;
  sortTrigger.setAttribute("aria-expanded", "true");

  const selected = sortMenu.querySelector(".sort-option.active");
  (selected || sortOptions[0]).focus();
}

function chooseSort(option) {
  const value = option.dataset.value;

  $("sortResults").value = value;
  sortSelected.textContent = option.textContent.trim();

  sortOptions.forEach(item => {
    const active = item === option;

    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", String(active));
  });

  closeSortMenu(true);
  renderCatalog();
}

sortTrigger.addEventListener("click", () => {
  if (sortMenu.hidden) {
    openSortMenu();
  } else {
    closeSortMenu();
  }
});

sortOptions.forEach((option, index) => {
  option.addEventListener("click", () => chooseSort(option));

  option.addEventListener("keydown", event => {
    let next = index;

    if (event.key === "ArrowDown") {
      next = (index + 1) % sortOptions.length;
    } else if (event.key === "ArrowUp") {
      next = (index - 1 + sortOptions.length) % sortOptions.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = sortOptions.length - 1;
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeSortMenu(true);
      return;
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      chooseSort(option);
      return;
    } else {
      return;
    }

    event.preventDefault();
    sortOptions[next].focus();
  });
});

sortTrigger.addEventListener("keydown", event => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    openSortMenu();
  }
});

document.addEventListener("click", event => {
  if (!sortDropdown.contains(event.target)) {
    closeSortMenu();
  }
});

sortDropdown.addEventListener("focusout", event => {
  if (!sortDropdown.contains(event.relatedTarget)) {
    closeSortMenu();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !sortMenu.hidden) {
    closeSortMenu(true);
  }
});


  $("clearFilters").addEventListener("click", resetFilters);
  $("emptyReset").addEventListener("click", resetFilters);

  $("clearSearch").addEventListener("click", () => {
    $("librarySearch").value = "";
    renderCatalog();
    $("librarySearch").focus();
  });

  [
    "librarySearch",
    "filterType",
    "filterYear",
    "filterInstitution",
    "filterFormat",
    "sortResults"
  ].forEach(id => {
    const input = $(id);
    input.addEventListener(
      id === "librarySearch" ? "input" : "change",
      renderCatalog
    );
  });

  function filteredCatalog() {
    const query = normalize($("librarySearch").value.trim());
    const type = $("filterType").value;
    const year = $("filterYear").value;
    const institution = $("filterInstitution").value;
    const format = $("filterFormat").value;
    const sort = $("sortResults").value;

    const results = catalog.filter(resource => {
      const groupMatches =
        activeTab === "guardados"
          ? favorites.has(resource.id)
          : resource.group === activeTab;

      const searchable = normalize([
        resource.title,
        resource.author,
        resource.institution,
        resource.description,
        ...resource.keywords
      ].join(" "));

      return (
        groupMatches &&
        (!query || searchable.includes(query)) &&
        (type === "todos" || resource.type === type) &&
        (year === "todos" || String(resource.year) === year) &&
        (institution === "todos" ||
          resource.institution === institution) &&
        (format === "todos" || resource.format === format)
      );
    });

    results.sort((a, b) => {
      if (sort === "antiguos") return a.year - b.year;
      if (sort === "az") return a.title.localeCompare(b.title, "es");
      if (sort === "za") return b.title.localeCompare(a.title, "es");
      return b.year - a.year;
    });

    return results;
  }

  // ==========================================
  // 11. TARJETAS
  // ==========================================

  function resourceTypeLabel(resource) {
    const labels = {
      tesis: "TESIS",
      articulo: "ARTÍCULO CIENTÍFICO",
      paper: "PAPER",
      guia: "GUÍA METODOLÓGICA",
      plantilla: "PLANTILLA",
      norma: "NORMAS Y CITACIÓN"
    };

    return labels[resource.type] || "RECURSO";
  }

  function createTag(text) {
    return el("span", "keyword-tag", text);
  }

  function createCard(resource) {
    const card = el("article", "resource-card");

    const top = el("div", "resource-card-top");
    const symbol = el("div", "resource-symbol");

    symbol.append(makeIcon(resource.icon));

    const topRight = el("div", "resource-card-top-right");
    topRight.append(el("span", "resource-year", resource.year));

    const favorite = makeButton(
      "", "bookmark", "favorite-button",
      () => toggleFavorite(resource.id)
    );

    favorite.classList.toggle(
      "is-saved",
      favorites.has(resource.id)
    );

    favorite.title = favorites.has(resource.id)
      ? "Quitar de guardados"
      : "Guardar recurso";

    favorite.setAttribute("aria-label", favorite.title);
    favorite.setAttribute(
      "aria-pressed",
      String(favorites.has(resource.id))
    );

    topRight.append(favorite);
    top.append(symbol, topRight);

    const category = el(
      "span",
      "resource-category",
      resourceTypeLabel(resource)
    );

    const title = el("h3", "", resource.title);

    const byline = el(
      "p",
      "resource-byline",
      `${resource.author} · ${resource.institution}`
    );

    const description = el(
      "p",
      "resource-description",
      resource.description
    );

    const tags = el("div", "resource-keywords");

    resource.keywords.slice(0, 3).forEach(keyword => {
      tags.append(createTag(keyword));
    });

    const bottom = el("div", "resource-card-bottom");

    const format = el("div", "resource-format");
    format.append(
      makeIcon("file-text"),
      document.createTextNode(`${resource.format} · Ejemplo`)
    );

    const actions = el("div", "resource-card-actions");

    const details = makeButton(
      "Ver ficha",
      "book-open",
      "card-action primary",
      () => openModal(resource.id)
    );

    actions.append(details);
    bottom.append(format, actions);

    card.append(
      top, category, title, byline,
      description, tags, bottom
    );

    return card;
  }

  function renderCatalog() {
    const results = filteredCatalog();
    const list = $("libraryList");

    list.replaceChildren();

    list.classList.toggle(
      "resources-layout",
      activeTab === "recursos"
    );

    results.forEach(resource => {
      list.append(createCard(resource));
    });

    $("resultsCount").textContent =
      `${results.length} resultado${results.length === 1 ? "" : "s"}`;

    $("savedCount").textContent = favorites.size;

    $("clearSearch").hidden =
      $("librarySearch").value.length === 0;

    const empty = results.length === 0;

    $("libraryEmpty").hidden = !empty;

    if (empty) {
      $("emptyTitle").textContent =
        activeTab === "guardados" && favorites.size === 0
          ? "Todavía no tienes recursos guardados"
          : "No encontramos resultados";

      $("emptyDescription").textContent =
        activeTab === "guardados" && favorites.size === 0
          ? "Guarda investigaciones y materiales desde sus tarjetas."
          : "Prueba con otras palabras o restablece los filtros.";
    }

    icons();
  }

  // ==========================================
  // 12. FICHA DETALLADA
  // ==========================================

  const modal = $("resourceModal");

  function selectedResource() {
    return catalog.find(r => r.id === selectedResourceId);
  }

  function metadataField(label, value) {
    const field = el("div", "metadata-field");
    field.append(
      el("span", "", label),
      el("strong", "", value || "No disponible")
    );

    return field;
  }

  function apaCitation(resource) {
    // Solo ejemplo de formato a partir
    // de metadatos ficticios.
    //
    // El generador definitivo utilizará
    // autores y metadatos verificados.

    const author = resource.author || "Autor no disponible";

    if (resource.type === "tesis") {
      return (
        `${author}. (${resource.year}). ` +
        `${resource.title} [Tesis de ${resource.level.toLowerCase()}, ` +
        `${resource.institution}].`
      );
    }

    return (
      `${author}. (${resource.year}). ${resource.title}. ` +
      `${resource.institution}.`
    );
  }

  function authorSurname(name) {
    return name.trim().split(/\s+/).at(-1) || "Autor";
  }

  function updateModalFavorite() {
    const resource = selectedResource();
    if (!resource) return;

    const saved = favorites.has(resource.id);
    const button = $("modalFavorite");

    button.querySelector("svg")?.remove();
    button.querySelector("i")?.remove();

    button.replaceChildren(
      makeIcon(saved ? "bookmark-check" : "bookmark"),
      document.createTextNode(
        saved ? "Quitar de guardados" : "Guardar recurso"
      )
    );

    button.setAttribute("aria-pressed", String(saved));
    icons();
  }

  function openModal(id) {
    const resource = catalog.find(item => item.id === id);
    if (!resource) return;

    selectedResourceId = id;
    previousFocus = document.activeElement;

    $("modalResourceType").textContent =
      resourceTypeLabel(resource);

    $("resourceModalTitle").textContent = resource.title;
    $("resourceModalDescription").textContent =
      resource.description;

    const metadata = $("resourceMetadata");
    metadata.replaceChildren(
      metadataField("Autor", resource.author),
      metadataField("Año de publicación", String(resource.year)),
      metadataField("Institución", resource.institution),
      metadataField("Nivel / material", resource.level),
      metadataField("Formato", resource.format),
      metadataField(
        "Fuente original",
        resource.verified ? "Verificada" : "No disponible en demo"
      )
    );

    const keywords = $("modalKeywords");
    keywords.replaceChildren();

    resource.keywords.forEach(keyword => {
      keywords.append(createTag(keyword));
    });

    const hasCitation = resource.group === "investigaciones";
    $("citationSection").hidden = !hasCitation;

    if (hasCitation) {
      $("citationText").textContent = apaCitation(resource);

      $("inlineCitation").textContent =
        `(${authorSurname(resource.author)}, ${resource.year})`;
    }

    const openButton = $("openResource");

    const hasSource =
      resource.verified &&
      typeof resource.url === "string" &&
      /^https:\/\//i.test(resource.url);

    openButton.disabled = !hasSource;
    openButton.title = hasSource
      ? "Abrir fuente original"
      : "Fuente no disponible en esta demostración";

    updateModalFavorite();

    modal.hidden = false;
    body.style.overflow = "hidden";

    $("closeResourceModal").focus();
    icons();
  }

  function closeModal() {
    if (modal.hidden) return;

    modal.hidden = true;
    body.style.overflow = "";
    selectedResourceId = null;

    // Si se actualizó la lista mientras el modal
    // estaba abierto, el botón original puede
    // haber desaparecido.
    if (previousFocus?.isConnected) {
      previousFocus.focus();
    } else {
      $("librarySearch").focus();
    }
  }

  $("closeResourceModal").addEventListener("click", closeModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  // Mantener el foco dentro del modal
  modal.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;

    const controls = [...modal.querySelectorAll(
      "button:not([disabled]):not([hidden]), " +
      "a[href], input:not([disabled])"
    )].filter(node => node.getClientRects().length > 0);

    if (!controls.length) return;

    const first = controls[0];
    const last = controls.at(-1);

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey &&
               document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  $("modalFavorite").addEventListener("click", () => {
    if (selectedResourceId) {
      toggleFavorite(selectedResourceId);
    }
  });

  $("copyCitation").addEventListener("click", async () => {
    const resource = selectedResource();
    if (!resource) return;

    try {
      await navigator.clipboard.writeText(apaCitation(resource));
      toast("Referencia ilustrativa copiada. Verifica los datos antes de citar.");
    } catch {
      toast("No fue posible copiar desde el navegador.");
    }
  });

  $("openResource").addEventListener("click", () => {
    const resource = selectedResource();

    if (
      resource?.verified &&
      typeof resource.url === "string" &&
      /^https:\/\//i.test(resource.url)
    ) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
    }
  });

  // ==========================================
  // 13. TECLADO Y CIERRE
  // ==========================================

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeModal();
      closeMobileMenu();
      closeNotifications();
    }
  });

  // ==========================================
  // 14. INICIALIZACIÓN
  // ==========================================

  populateFilters();

  const initialTab = new URLSearchParams(
    location.search
  ).get("tab");

  selectTab(initialTab, false);
  icons();

});
