
document.addEventListener("DOMContentLoaded", () => {

  const $ = id => document.getElementById(id);
  const body = document.body;
  const root = document.documentElement;

  // ============================================
  // 1. APARIENCIA
  // ============================================

  const savedTheme = localStorage.getItem("tesisLiveTheme");

  root.dataset.theme = ["light", "dark", "system"].includes(savedTheme)
    ? savedTheme
    : "system";

  // ============================================
  // 2. NAVEGACIÓN AUTOMÁTICA
  // ============================================

  const currentFile = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

  const pageMapping = {
    "dashboard.html": "inicio",
    "asesor-ia.html": "asesor-ia",
    "proyectos.html": "proyectos",
    "biblioteca.html": "biblioteca",
    "configuracion.html": "configuracion"
  };

  const currentPage = pageMapping[currentFile] || "inicio";

  document.querySelectorAll(".sidebar .nav-link[data-page]")
    .forEach(link => {

      const isActive = link.dataset.page === currentPage;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }

    });

  // ============================================
  // 3. ICONOS LUCIDE
  // ============================================

  function renderIcons() {
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }
  }

  renderIcons();

  // ============================================
  // 4. SIDEBAR CONTRAÍBLE
  // ============================================

  const sidebarCollapse = $("sidebarCollapse");

  const savedSidebar = localStorage.getItem("tesisLiveSidebar");

  if (savedSidebar === "collapsed") {
    body.classList.add("sidebar-collapsed");
  }

  function updateSidebarButton() {
    const collapsed = body.classList.contains("sidebar-collapsed");

    sidebarCollapse.setAttribute(
      "aria-label",
      collapsed ? "Expandir menú" : "Contraer menú"
    );

    sidebarCollapse.title =
      collapsed ? "Expandir menú" : "Contraer menú";
  }

  updateSidebarButton();

  sidebarCollapse.addEventListener("click", () => {

    body.classList.toggle("sidebar-collapsed");

    const collapsed = body.classList.contains("sidebar-collapsed");

    localStorage.setItem(
      "tesisLiveSidebar",
      collapsed ? "collapsed" : "expanded"
    );

    updateSidebarButton();
  });

  // ============================================
  // 5. SIDEBAR EN MÓVILES
  // ============================================

  const mobileMenu = $("mobileMenu");
  const sidebarOverlay = $("sidebarOverlay");

  function closeMobileMenu() {
    body.classList.remove("mobile-sidebar-open");
    mobileMenu.setAttribute("aria-expanded", "false");
  }

  mobileMenu.addEventListener("click", () => {

    const isOpen = body.classList.toggle("mobile-sidebar-open");

    mobileMenu.setAttribute("aria-expanded", String(isOpen));
  });

  sidebarOverlay.addEventListener("click", closeMobileMenu);

  window.matchMedia("(max-width: 850px)")
    .addEventListener("change", closeMobileMenu);

  // ============================================
  // 6. FECHA
  // ============================================

  const currentDate = $("currentDate");

  if (currentDate) {
    currentDate.textContent = new Date().toLocaleDateString("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  // ============================================
  // 7. DATOS DE DEMOSTRACIÓN
  // ============================================

  const dashboardData = {
    projects: 3,
    savedResources: 18,
    credits: 12,
    weeklyHours: "5h 30m",

    project: {
      title: "Marketing digital en PYMES",
      completedStages: 5,
      totalStages: 10
    }
  };

  const statistics = {
    statProjects: dashboardData.projects,
    statSaved: dashboardData.savedResources,
    statCredits: dashboardData.credits,
    statHours: dashboardData.weeklyHours
  };

  Object.entries(statistics).forEach(([id, value]) => {
    const element = $(id);

    if (element) {
      element.textContent = value;
    }
  });

  // ============================================
  // 8. PORCENTAJE DE AVANCE
  // ============================================

  function calculateProgress(completed, total) {
    if (!total || total <= 0) return 0;

    const result = Math.round((completed / total) * 100);

    return Math.max(0, Math.min(100, result));
  }

  const progress = calculateProgress(
    dashboardData.project.completedStages,
    dashboardData.project.totalStages
  );

  const progressCircle = $("progressCircle");
  const progressNumber = $("progressNumber");
  const projectTitle = $("projectTitle");

  if (progressCircle) {
    progressCircle.style.setProperty("--progress", progress);

    progressCircle.setAttribute(
      "aria-valuenow",
      String(progress)
    );
  }

  if (progressNumber) {
    progressNumber.textContent = `${progress}%`;
  }

  if (projectTitle) {
    projectTitle.textContent = dashboardData.project.title;
  }

  // ============================================
  // 9. NOTIFICACIONES
  // ============================================

  const notificationButton = $("notificationButton");
  const notificationPopover = $("notificationPopover");

  function closeNotifications() {
    notificationPopover.hidden = true;

    notificationButton.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  notificationButton.addEventListener("click", event => {
    event.stopPropagation();

    const willOpen = notificationPopover.hidden;

    notificationPopover.hidden = !willOpen;

    notificationButton.setAttribute(
      "aria-expanded",
      String(willOpen)
    );
  });

  document.addEventListener("click", event => {

    const clickedInside =
      notificationPopover.contains(event.target) ||
      notificationButton.contains(event.target);

    if (!clickedInside) {
      closeNotifications();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeNotifications();
      closeMobileMenu();
    }
  });

  // ============================================
  // 10. SALIR (MODO DEMOSTRACIÓN)
  // ============================================

  // El enlace de Salir apunta a login.html.
  // No hay una sesión real que cerrar todavía.
  // Cuando conectemos el backend, aquí se
  // implementará el cierre seguro de sesión.

});
