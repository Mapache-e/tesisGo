
document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. UTILIDADES
  // ==========================================

  const $ = id => document.getElementById(id);
  const body = document.body;
  const root = document.documentElement;

  const STORAGE = {
    theme: "tesisLiveTheme",
    sidebar: "tesisLiveSidebar",
    phone: "tesisLiveDemoPhone",
    notifications: "tesisLiveDemoNotifications"
  };

  function icons() {
    window.lucide?.createIcons();
  }

  function makeIcon(name) {
    const node = document.createElement("i");
    node.setAttribute("data-lucide", name);
    return node;
  }

  function readStorage(key, fallback = null) {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  let toastTimer = null;

  function toast(message) {
    const element = $("settingsToast");
    element.textContent = message;
    element.hidden = false;

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      element.hidden = true;
    }, 3200);
  }

  // ==========================================
  // 2. TEMA GUARDADO
  // ==========================================

  const validThemes = ["light", "dark", "system"];

  let selectedTheme = readStorage(
    STORAGE.theme,
    "system"
  );

  if (!validThemes.includes(selectedTheme)) {
    selectedTheme = "system";
  }

  root.dataset.theme = selectedTheme;

  // ==========================================
  // 3. NAVEGACIÓN AUTOMÁTICA
  // ==========================================

  const fileName = location.pathname
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

  const currentPage = pageMapping[fileName];

  document.querySelectorAll(".sidebar .nav-link[data-page]")
    .forEach(link => {

      const active = link.dataset.page === currentPage;

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
    readStorage(STORAGE.sidebar) === "collapsed"
  );

  function updateCollapseButton() {
    const isCollapsed = body.classList.contains(
      "sidebar-collapsed"
    );

    collapse.setAttribute(
      "aria-label",
      isCollapsed ? "Expandir menú" : "Contraer menú"
    );

    collapse.title = isCollapsed
      ? "Expandir menú"
      : "Contraer menú";
  }

  updateCollapseButton();

  collapse.addEventListener("click", () => {
    body.classList.toggle("sidebar-collapsed");

    const isCollapsed = body.classList.contains(
      "sidebar-collapsed"
    );

    writeStorage(
      STORAGE.sidebar,
      isCollapsed ? "collapsed" : "expanded"
    );

    updateCollapseButton();
  });

  // ==========================================
  // 5. SIDEBAR MÓVIL
  // ==========================================

  function closeMobileMenu() {
    body.classList.remove("mobile-sidebar-open");
    mobileMenu.setAttribute("aria-expanded", "false");
  }

  mobileMenu.addEventListener("click", () => {
    const open = body.classList.toggle(
      "mobile-sidebar-open"
    );

    mobileMenu.setAttribute(
      "aria-expanded",
      String(open)
    );
  });

  $("sidebarOverlay").addEventListener(
    "click",
    closeMobileMenu
  );

  window.matchMedia("(max-width: 850px)")
    .addEventListener("change", closeMobileMenu);

  // ==========================================
  // 6. NOTIFICACIONES DEL HEADER
  // ==========================================

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

    const open = notificationPopover.hidden;
    notificationPopover.hidden = !open;

    notificationButton.setAttribute(
      "aria-expanded",
      String(open)
    );
  });

  document.addEventListener("click", event => {
    if (
      !notificationButton.contains(event.target) &&
      !notificationPopover.contains(event.target)
    ) {
      closeNotifications();
    }
  });

  // ==========================================
  // 7. PERFIL: TELÉFONO
  // ==========================================

  const phoneInput = $("profilePhone");

  phoneInput.value = readStorage(
    STORAGE.phone,
    "+51 987 654 321"
  );

  $("profileForm").addEventListener("submit", event => {
    event.preventDefault();

    const phone = phoneInput.value.trim();
    const digits = phone.replace(/\D/g, "");

    const valid =
      /^9\d{8}$/.test(digits) ||
      /^519\d{8}$/.test(digits);

    if (!valid) {
      toast("Ingresa un número celular peruano válido.");
      phoneInput.focus();
      return;
    }

    const number = digits.slice(-9);

    const formatted =
      "+51 " +
      number.slice(0, 3) + " " +
      number.slice(3, 6) + " " +
      number.slice(6, 9);

    phoneInput.value = formatted;

    if (writeStorage(STORAGE.phone, formatted)) {
      toast("Cambios guardados correctamente.");
    } else {
      toast("No se pudieron guardar los cambios.");
    }
  });

  // ==========================================
  // 8. FOTO DE PERFIL
  // ==========================================

  const avatarInput = $("avatarInput");
  const profileImage = $("profileImage");
  const initials = $("profileInitials");
  const removeAvatar = $("removeAvatar");

  let avatarURL = null;

  function resetAvatar() {
    if (avatarURL) {
      URL.revokeObjectURL(avatarURL);
      avatarURL = null;
    }

    profileImage.removeAttribute("src");
    profileImage.hidden = true;
    initials.hidden = false;
    removeAvatar.hidden = true;
    avatarInput.value = "";
  }

  avatarInput.addEventListener("change", event => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowed = [
      "image/png",
      "image/jpeg",
      "image/webp"
    ];

    if (!allowed.includes(file.type)) {
      toast("Selecciona una imagen JPG, PNG o WebP.");
      avatarInput.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast("La fotografía no debe superar 2 MB.");
      avatarInput.value = "";
      return;
    }

    if (avatarURL) {
      URL.revokeObjectURL(avatarURL);
    }

    avatarURL = URL.createObjectURL(file);

    profileImage.src = avatarURL;
    profileImage.hidden = false;
    initials.hidden = true;
    removeAvatar.hidden = false;
  });

  removeAvatar.addEventListener("click", resetAvatar);

  window.addEventListener("pagehide", () => {
    if (avatarURL) {
      URL.revokeObjectURL(avatarURL);
      avatarURL = null;
    }
  });

  // ==========================================
  // 9. MOSTRAR Y OCULTAR CONTRASEÑA
  // ==========================================

  document.querySelectorAll(".password-visibility")
    .forEach(button => {

      button.addEventListener("click", () => {
        const input = $(button.dataset.target);

        const show = input.type === "password";

        input.type = show ? "text" : "password";

        button.setAttribute(
          "aria-label",
          show ? "Ocultar contraseña" : "Mostrar contraseña"
        );

        button.setAttribute(
          "aria-pressed",
          String(show)
        );

        button.replaceChildren(
          makeIcon(show ? "eye-off" : "eye")
        );

        icons();
      });
    });

  // El formulario no realiza cambios de cuenta.
  // Su funcionamiento real se implementará con
  // la autenticación y el backend.

  $("passwordForm").addEventListener("submit", event => {
    event.preventDefault();
  });

  // ==========================================
  // 10. APARIENCIA
  // ==========================================

  function updateThemeCards() {
    document.querySelectorAll(".theme-option")
      .forEach(card => {

        const selected =
          card.dataset.themeOption === selectedTheme;

        card.classList.toggle("selected", selected);

        const radio = card.querySelector(
          'input[name="appearance"]'
        );

        radio.checked = selected;

        const oldIcon = card.querySelector(
          ".theme-option-bottom svg, .theme-option-bottom i"
        );

        if (oldIcon) {
          oldIcon.replaceWith(
            makeIcon(selected ? "check-circle-2" : "circle")
          );
        }
      });

    icons();
  }

  function setTheme(theme) {
    if (!validThemes.includes(theme)) return;

    selectedTheme = theme;
    root.dataset.theme = theme;

    writeStorage(STORAGE.theme, theme);
    updateThemeCards();
  }

  document.querySelectorAll('input[name="appearance"]')
    .forEach(input => {

      input.addEventListener("change", () => {
        if (input.checked) {
          setTheme(input.value);
        }
      });
    });

  updateThemeCards();

  // ==========================================
  // 11. PREFERENCIAS DE NOTIFICACIÓN
  // ==========================================

  const notificationIds = [
    "notifyReviews",
    "notifyProgress",
    "notifyNews"
  ];

  const notificationDefaults = {
    notifyReviews: true,
    notifyProgress: true,
    notifyNews: false
  };

  let savedPreferences = {};

  try {
    const stored = JSON.parse(
      readStorage(STORAGE.notifications, "{}")
    );

    if (
      stored &&
      typeof stored === "object" &&
      !Array.isArray(stored)
    ) {
      savedPreferences = stored;
    }
  } catch {
    savedPreferences = {};
  }

  notificationIds.forEach(id => {
    const input = $(id);

    input.checked =
      typeof savedPreferences[id] === "boolean"
        ? savedPreferences[id]
        : notificationDefaults[id];

    input.addEventListener("change", () => {
      const preferences = {};

      notificationIds.forEach(key => {
        preferences[key] = $(key).checked;
      });

      writeStorage(
        STORAGE.notifications,
        JSON.stringify(preferences)
      );
    });
  });

  // ==========================================
  // 12. MOSTRAR Y OCULTAR PLANES
  // ==========================================

  const changePlanButton = $("changePlanButton");
  const plansContainer = $("plansContainer");

  changePlanButton.addEventListener("click", () => {
    const open = plansContainer.hidden;

    plansContainer.hidden = !open;

    changePlanButton.setAttribute(
      "aria-expanded",
      String(open)
    );

    changePlanButton.replaceChildren(
      makeIcon(open ? "chevron-up" : "arrow-left-right"),
      document.createTextNode(
        open ? "Ocultar planes" : "Ver otros planes"
      )
    );

    icons();
  });

  // ==========================================
  // 13. CAMBIO DE PLAN: CONFIRMACIÓN
  // ==========================================

  const planModal = $("planModal");
  const planModalTitle = $("planModalTitle");
  const planModalDescription = $("planModalDescription");

  let selectedPlan = null;
  let previousFocus = null;

  function openPlanModal(plan) {
    selectedPlan = plan;
    previousFocus = document.activeElement;

    planModalTitle.textContent = `Cambiar a ${plan}`;

    if (plan === "Por créditos") {
      planModalDescription.textContent =
        "Al cambiar a créditos, dejarás de renovar " +
        "tu suscripción Pro Ilimitado. Mantendrás los " +
        "beneficios del período que ya pagaste hasta " +
        "su fecha de vencimiento.";
    } else {
      planModalDescription.textContent =
        "Estás por solicitar el cambio al plan " +
        `${plan}. Tu suscripción actual se mantendrá ` +
        "hasta finalizar el período pagado.";
    }

    planModal.hidden = false;
    $("cancelPlanChange").focus();
  }

  function closePlanModal() {
    if (planModal.hidden) return;

    planModal.hidden = true;
    selectedPlan = null;

    if (previousFocus?.isConnected) {
      previousFocus.focus();
    }
  }

  document.querySelectorAll(".plan-choice")
    .forEach(button => {

      button.addEventListener("click", () => {
        openPlanModal(button.dataset.plan);
      });
    });

  $("cancelPlanChange").addEventListener(
    "click",
    closePlanModal
  );

  planModal.addEventListener("click", event => {
    if (event.target === planModal) {
      closePlanModal();
    }
  });

  // Conservar la confirmación visual sin registrar
  // cambios ficticios de suscripción.
  $("confirmPlanChange").addEventListener("click", () => {
    closePlanModal();
  });

  // Control básico de foco dentro de la ventana.
  planModal.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;

    const controls = [
      $("cancelPlanChange"),
      $("confirmPlanChange")
    ];

    const first = controls[0];
    const last = controls[controls.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === last
    ) {
      event.preventDefault();
      first.focus();
    }
  });

  // ==========================================
  // 14. CERRAR VENTANAS CON ESCAPE
  // ==========================================

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMobileMenu();
      closeNotifications();
      closePlanModal();
    }
  });

  // ==========================================
  // 15. INICIALIZACIÓN
  // ==========================================

  icons();

});
