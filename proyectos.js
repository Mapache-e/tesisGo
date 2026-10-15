
document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // UTILIDADES
  // ==========================================

  const $ = id => document.getElementById(id);
  const root = document.documentElement;
  const body = document.body;

  const STORAGE_KEY = "tesisLiveDemoProjectsV1";

  const STAGES = [
    "Tema y delimitación",
    "Planteamiento del problema",
    "Objetivos de investigación",
    "Justificación",
    "Antecedentes",
    "Marco teórico",
    "Metodología",
    "Instrumentos de investigación",
    "Resultados y discusión",
    "Conclusiones y revisión final"
  ];

  function icons() {
    window.lucide?.createIcons();
  }

  function makeIcon(name) {
    const element = document.createElement("i");
    element.setAttribute("data-lucide", name);
    return element;
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);

    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;

    return node;
  }

  function button(label, iconName, className, callback) {
    const node = el("button", className);
    node.type = "button";

    if (iconName) node.append(makeIcon(iconName));
    if (label) node.append(document.createTextNode(label));

    node.addEventListener("click", callback);
    return node;
  }

  function formatDate(iso) {
    if (!iso) return "Sin fecha";

    const date = new Date(iso + "T12:00:00");

    return Number.isNaN(date.getTime())
      ? "Sin fecha"
      : date.toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
  }

  function todayISO() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function percent(project) {
    const total = project.stages.length;
    if (!total) return 0;

    return Math.round(
      project.stages.filter(Boolean).length / total * 100
    );
  }

  let toastTimer;

  function toast(message) {
    const node = $("projectsToast");
    node.textContent = message;
    node.hidden = false;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      node.hidden = true;
    }, 3400);
  }

  // ==========================================
  // APARIENCIA
  // ==========================================

  const theme = localStorage.getItem("tesisLiveTheme");

  root.dataset.theme = ["light", "dark", "system"].includes(theme)
    ? theme
    : "system";

  // ==========================================
  // NAVEGACIÓN PRINCIPAL
  // ==========================================

  const currentFile = window.location.pathname
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
  // SIDEBAR
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
    const open = body.classList.toggle("mobile-sidebar-open");
    mobileMenu.setAttribute("aria-expanded", String(open));
  });

  $("sidebarOverlay").addEventListener("click", closeMobileMenu);

  window.matchMedia("(max-width: 850px)")
    .addEventListener("change", closeMobileMenu);

  // ==========================================
  // NOTIFICACIONES
  // ==========================================

  const notificationButton = $("notificationButton");
  const notificationPopover = $("notificationPopover");

  function closeNotifications() {
    notificationPopover.hidden = true;
    notificationButton.setAttribute("aria-expanded", "false");
  }

  notificationButton.addEventListener("click", event => {
    event.stopPropagation();

    const open = notificationPopover.hidden;
    notificationPopover.hidden = !open;

    notificationButton.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", event => {
    if (!notificationPopover.contains(event.target) &&
        !notificationButton.contains(event.target)) {
      closeNotifications();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeNotifications();
      closeMobileMenu();
      closeModal();
    }
  });

  // ==========================================
  // DATOS INICIALES DE DEMOSTRACIÓN
  // ==========================================

  const sampleProjects = [
    {
      id: 1,
      name: "Marketing digital en PYMES",
      type: "Tesis",
      description: "Investigación sobre estrategias digitales en pequeñas y medianas empresas.",
      status: "desarrollo",
      updated: "2026-10-14",
      stages: [true,true,true,true,true,false,false,false,false,false],
      files: [
        {id:101,name:"primer-avance.pdf",size:1.8},
        {id:102,name:"marco-teorico.pdf",size:2.4}
      ]
    },
    {
      id: 2,
      name: "Impacto de la IA en la educación",
      type: "Paper",
      description: "Estudio sobre el uso de inteligencia artificial en contextos educativos.",
      status: "desarrollo",
      updated: "2026-10-12",
      stages: [true,true,true,true,true,true,true,false,false,false],
      files: [
        {id:201,name:"investigacion-ia.pdf",size:1.1}
      ]
    },
    {
      id: 3,
      name: "Satisfacción estudiantil universitaria",
      type: "Tesis",
      description: "Análisis de factores asociados con la satisfacción estudiantil.",
      status: "desarrollo",
      updated: "2026-10-10",
      stages: [true,true,true,true,true,true,true,true,false,false],
      files: [
        {id:301,name:"objetivos.pdf",size:0.8},
        {id:302,name:"metodologia.pdf",size:1.3}
      ]
    },
    {
      id: 4,
      name: "Estrategias de branding personal",
      type: "Trabajo académico",
      description: "Análisis de estrategias de marca personal en medios digitales.",
      status: "borrador",
      updated: "2026-10-08",
      stages: [true,true,true,false,false,false,false,false,false,false],
      files: []
    }
  ];

  function loadProjects() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored !== null) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.warn("No se pudo leer la demo guardada.", error);
    }

    return structuredClone(sampleProjects);
  }

  let projects = loadProjects();
  let expandedProjectId = null;

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.warn("No se pudo guardar en localStorage.", error);
      toast("El navegador no pudo guardar los cambios locales.");
    }
  }

  function refresh() {
    renderDocuments();
    renderProgress();
    renderSummary();
    icons();
  }

  // ==========================================
  // PESTAÑAS
  // ==========================================

  const validTabs = ["documentos", "progreso", "resumen"];

  function selectTab(tab, updateUrl = true) {
    if (!validTabs.includes(tab)) tab = "documentos";

    document.querySelectorAll(".project-tab").forEach(control => {
      const active = control.dataset.tab === tab;

      control.classList.toggle("active", active);
      control.setAttribute("aria-selected", String(active));
      control.tabIndex = active ? 0 : -1;
    });

    validTabs.forEach(name => {
      $(`panel-${name}`).hidden = name !== tab;
    });

    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      history.replaceState(null, "", url);
    }
  }

  document.querySelectorAll(".project-tab").forEach(control => {
    control.addEventListener("click", () => {
      selectTab(control.dataset.tab);
    });

    control.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        return;
      }

      event.preventDefault();

      const index = validTabs.indexOf(control.dataset.tab);
      let next = index;

      if (event.key === "ArrowRight") next = (index + 1) % validTabs.length;
      if (event.key === "ArrowLeft") next = (index + validTabs.length - 1) % validTabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = validTabs.length - 1;

      selectTab(validTabs[next]);
      $(`tab-${validTabs[next]}`).focus();
    });
  });

  const initialTab = new URLSearchParams(window.location.search).get("tab");
  selectTab(initialTab, false);

  // ==========================================
  // DOCUMENTOS
  // ==========================================

  function makeProgressTrack(value) {
    const track = el("div", "progress-track");
    const fill = el("div", "progress-fill");
    fill.style.width = `${value}%`;
    track.append(fill);
    return track;
  }

  function emptyState(message) {
    const box = el("div", "empty-projects");
    box.append(makeIcon("folder-open"));

    const title = el("h3", "", message);
    const subtitle = el(
      "p",
      "",
      "Puedes crear un proyecto o modificar los filtros de búsqueda."
    );

    box.append(title, subtitle);
    return box;
  }

  function touch(project) {
    project.updated = todayISO();
    save();
    refresh();
  }

  function toggleDetails(id) {
    expandedProjectId = expandedProjectId === id ? null : id;
    renderDocuments();
    icons();
  }

  function renderDocuments() {
    const container = $("documentsList");
    container.replaceChildren();

    const search = $("projectSearch").value.trim().toLocaleLowerCase("es");
    const filter = $("projectFilter").value;

    const list = projects.filter(project => {
      const matchesName = project.name
        .toLocaleLowerCase("es")
        .includes(search);

      const matchesStatus =
        filter === "todos" || project.status === filter;

      return matchesName && matchesStatus;
    });

    if (list.length === 0) {
      container.append(emptyState("No hay proyectos para mostrar"));
      icons();
      return;
    }

    list.forEach(project => {
      const card = el("article", "document-card");
      const main = el("div", "document-card-main");

      const iconBox = el("div", "document-icon");
      iconBox.append(makeIcon("file-text"));

      const info = el("div", "document-info");
      info.append(el("h3", "", project.name));

      const description = el(
        "p",
        "",
        `${project.type} · ${project.files.length} archivo(s) · Editado ${formatDate(project.updated)}`
      );
      info.append(description);

      const progress = el("div", "document-progress");
      progress.append(
        makeProgressTrack(percent(project)),
        el("strong", "", `${percent(project)}%`)
      );

      const actions = el("div", "document-actions");

      const expand = button(
        "",
        expandedProjectId === project.id ? "chevron-up" : "chevron-down",
        "document-icon-button",
        () => toggleDetails(project.id)
      );

      expand.title = "Ver documentos y acciones";
      expand.setAttribute(
        "aria-label",
        `Ver detalles de ${project.name}`
      );
      expand.setAttribute(
        "aria-expanded",
        String(expandedProjectId === project.id)
      );

      actions.append(expand);
      main.append(iconBox, info, progress, actions);
      card.append(main);

      if (expandedProjectId === project.id) {
        card.append(renderDocumentDetails(project));
      }

      container.append(card);
    });

    icons();
  }

  function renderDocumentDetails(project) {
    const detail = el("div", "document-detail");
    const inner = el("div", "document-detail-inner");

    inner.append(
      el(
        "p",
        "document-detail-description",
        project.description || "Este proyecto todavía no tiene descripción."
      )
    );

    const heading = el("div", "document-detail-heading");
    heading.append(
      el("strong", "", "Archivos del proyecto"),
      el("span", "", `${project.files.length} registrado(s)`)
    );
    inner.append(heading);

    const fileList = el("div", "document-file-list");

    if (!project.files.length) {
      fileList.append(
        el(
          "p",
          "document-empty",
          "Todavía no has asociado ningún archivo a este proyecto."
        )
      );
    }

    project.files.forEach(file => {
      const row = el("div", "document-file");
      row.append(makeIcon("file-text"));

      const fileInfo = el("div", "document-file-info");
      fileInfo.append(
        el("strong", "", file.name),
        el("small", "", `PDF · ${file.size} MB · Solo referencia de demostración`)
      );

      const remove = button(
        "",
        "trash-2",
        "document-icon-button",
        () => {
          if (!confirm(`¿Quitar "${file.name}" del proyecto?`)) return;

          project.files = project.files.filter(item => item.id !== file.id);
          touch(project);
          toast("Referencia del archivo eliminada.");
        }
      );

      remove.title = "Quitar archivo";
      remove.setAttribute("aria-label", `Quitar ${file.name}`);

      row.append(fileInfo, remove);
      fileList.append(row);
    });

    inner.append(fileList);

    const actionRow = el("div", "detail-buttons");

    const addFile = button(
      "Agregar PDF",
      "file-plus-2",
      "secondary-action",
      () => selectPdf(project.id)
    );

    const viewProgress = button(
      "Ver progreso",
      "chart-no-axes-column",
      "secondary-action",
      () => {
        selectTab("progreso");
        window.scrollTo({top:0,behavior:"smooth"});
      }
    );

    const changeStatus = button(
      project.status === "finalizado"
        ? "Reabrir proyecto"
        : "Marcar finalizado",
      "circle-check",
      "secondary-action",
      () => {
        project.status =
          project.status === "finalizado" ? "desarrollo" : "finalizado";

        touch(project);
        toast("Estado del proyecto actualizado.");
      }
    );

    const deleteProject = button(
      "Eliminar proyecto",
      "trash-2",
      "secondary-action",
      () => {
        if (!confirm(`¿Eliminar el proyecto "${project.name}" de esta demo?`)) {
          return;
        }

        projects = projects.filter(item => item.id !== project.id);
        expandedProjectId = null;
        save();
        refresh();
        toast("Proyecto eliminado de la demostración.");
      }
    );

    actionRow.append(
      addFile,
      viewProgress,
      changeStatus,
      deleteProject
    );

    inner.append(actionRow);
    detail.append(inner);
    return detail;
  }

  $("projectSearch").addEventListener("input", renderDocuments);
  $("projectFilter").addEventListener("change", renderDocuments);

  // ==========================================
  // SIMULACIÓN DE ARCHIVOS PDF
  // ==========================================

  let uploadProjectId = null;

  const pdfInput = document.createElement("input");
  pdfInput.type = "file";
  pdfInput.accept = ".pdf,application/pdf";
  pdfInput.hidden = true;
  document.body.append(pdfInput);

  function selectPdf(projectId) {
    uploadProjectId = projectId;
    pdfInput.value = "";
    pdfInput.click();
  }

  pdfInput.addEventListener("change", event => {
    const file = event.target.files?.[0];
    const project = projects.find(item => item.id === uploadProjectId);

    if (!file || !project) return;

    const validPdf =
      file.name.toLowerCase().endsWith(".pdf") &&
      (!file.type || file.type === "application/pdf");

    if (!validPdf) {
      toast("Selecciona un archivo PDF válido.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast("El PDF supera el límite de demostración de 20 MB.");
      return;
    }

    project.files.push({
      id: Date.now(),
      name: file.name,
      size: Number((file.size / 1048576).toFixed(2))
    });

    // Se guarda únicamente el nombre y tamaño.
    // No se almacena el contenido del PDF.
    touch(project);

    toast("PDF registrado en la demo. El contenido no fue subido.");
  });

  // ==========================================
  // PROGRESO
  // ==========================================

  function renderProgress() {
    const container = $("progressList");
    container.replaceChildren();

    $("progressProjectCount").textContent = projects.length;

    const completed = projects.reduce(
      (sum, project) =>
        sum + project.stages.filter(Boolean).length,
      0
    );

    const total = projects.reduce(
      (sum, project) => sum + project.stages.length,
      0
    );

    $("completedStagesCount").textContent = completed;
    $("pendingStagesCount").textContent = total - completed;

    if (!projects.length) {
      container.append(emptyState("Aún no tienes proyectos"));
      return;
    }

    projects.forEach(project => {
      const card = el("article", "progress-project-card");
      const heading = el("div", "progress-project-heading");
      const projectInfo = el("div");

      projectInfo.append(
        el("h3", "", project.name),
        el("p", "", `${project.type} · ${statusLabel(project.status)}`)
      );

      heading.append(
        projectInfo,
        el("span", "progress-percent", `${percent(project)}%`)
      );

      card.append(heading, makeProgressTrack(percent(project)));
      card.append(el("h4", "stages-heading", "Etapas de investigación"));

      const stagesList = el("div", "stage-list");

      STAGES.forEach((name, index) => {
        const label = el("label", "stage-item");
        const checked = Boolean(project.stages[index]);

        label.classList.toggle("done", checked);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = checked;

        checkbox.setAttribute(
          "aria-label",
          `${name}, ${project.name}`
        );

        checkbox.addEventListener("change", () => {
          project.stages[index] = checkbox.checked;

          if (project.status === "finalizado" && !checkbox.checked) {
            project.status = "desarrollo";
          }

          touch(project);
        });

        label.append(checkbox, el("span", "", name));
        stagesList.append(label);
      });

      card.append(stagesList);

      card.append(
        el(
          "p",
          "stages-note",
          "Marca las etapas completadas para actualizar el porcentaje. Este avance es orientativo y no equivale a una evaluación académica."
        )
      );

      container.append(card);
    });
  }

  function statusLabel(status) {
    const names = {
      desarrollo: "En desarrollo",
      finalizado: "Finalizado",
      borrador: "Borrador"
    };

    return names[status] || "En desarrollo";
  }

  // ==========================================
  // RESUMEN
  // ==========================================

  function renderSummary() {
    const active = projects.filter(p => p.status === "desarrollo").length;
    const finished = projects.filter(p => p.status === "finalizado").length;

    const fileCount = projects.reduce(
      (total, project) => total + project.files.length, 0
    );

    const average = projects.length
      ? Math.round(
          projects.reduce((total, p) => total + percent(p), 0)
          / projects.length
        )
      : 0;

    $("summaryActive").textContent = active;
    $("summaryDocuments").textContent = fileCount;
    $("summaryFinished").textContent = finished;
    $("summaryAverage").textContent = `${average}%`;

    renderRecentProjects();
    renderActivity();
  }

  function renderRecentProjects() {
    const container = $("recentProjects");
    container.replaceChildren();

    const recent = [...projects]
      .sort((a, b) => b.updated.localeCompare(a.updated))
      .slice(0, 4);

    if (!recent.length) {
      container.append(el("p", "document-empty", "Sin proyectos recientes."));
      return;
    }

    recent.forEach(project => {
      const row = el("div", "recent-project");

      const symbol = el("div", "recent-project-icon");
      symbol.append(makeIcon("folder-open"));

      const info = el("div", "recent-project-content");
      info.append(
        el("strong", "", project.name),
        el(
          "small",
          "",
          `${project.type} · ${statusLabel(project.status)}`
        )
      );

      row.append(
        symbol,
        info,
        el("span", "recent-project-percent", `${percent(project)}%`)
      );

      container.append(row);
    });
  }

  function renderActivity() {
    const container = $("projectActivity");
    container.replaceChildren();

    const recent = [...projects]
      .sort((a, b) => b.updated.localeCompare(a.updated))
      .slice(0, 4);

    if (!recent.length) {
      container.append(
        el("p", "document-empty", "Todavía no existe actividad.")
      );
      return;
    }

    recent.forEach(project => {
      const row = el("div", "activity-entry");
      row.append(el("span", "activity-dot"));

      const info = el("div");

      info.append(
        el("strong", "", "Proyecto registrado o modificado"),
        el("small", "", project.name)
      );

      const time = el("time", "", formatDate(project.updated));
      time.dateTime = project.updated;

      row.append(info, time);
      container.append(row);
    });
  }

  // ==========================================
  // MODAL DE NUEVO PROYECTO
  // ==========================================

  const modal = $("projectModal");
  let lastFocusedElement = null;

  function openModal() {
    lastFocusedElement = document.activeElement;
    $("projectForm").reset();
    modal.hidden = false;
    body.style.overflow = "hidden";
    $("projectName").focus();
  }

  function closeModal() {
    if (modal.hidden) return;

    modal.hidden = true;
    body.style.overflow = "";
    lastFocusedElement?.focus();
  }

  $("newProjectButton").addEventListener("click", openModal);
  $("closeProjectModal").addEventListener("click", closeModal);
  $("cancelProjectModal").addEventListener("click", closeModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  modal.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;

    const focusable = [...modal.querySelectorAll(
      "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])"
    )];

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  $("projectForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = $("projectName").value.trim();
    const type = $("projectType").value;
    const description = $("projectDescription").value.trim();

    if (name.length < 3) {
      $("projectName").focus();
      toast("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    const project = {
      id: Date.now(),
      name,
      type,
      description,
      status: "borrador",
      updated: todayISO(),
      stages: STAGES.map(() => false),
      files: []
    };

    projects.unshift(project);
    expandedProjectId = project.id;

    save();
    closeModal();

    $("projectSearch").value = "";
    $("projectFilter").value = "todos";

    selectTab("documentos");
    refresh();

    toast("Nuevo proyecto creado en la demostración.");
  });

  // ==========================================
  // INICIALIZACIÓN
  // ==========================================

  refresh();

});
