
document.addEventListener("DOMContentLoaded", () => {

  // ============================================
  // UTILIDADES
  // ============================================

  const $ = id => document.getElementById(id);
  const body = document.body;
  const root = document.documentElement;

  function renderIcons() {
    window.lucide?.createIcons();
  }

  function createIcon(name) {
    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", name);
    return icon;
  }

  function showToast(message) {
    const element = $("toast");
    element.textContent = message;
    element.hidden = false;
  }

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

  const currentPage = pageMapping[currentFile] || "asesor-ia";

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
  // 3. SIDEBAR PRINCIPAL
  // ============================================

  const sidebarCollapse = $("sidebarCollapse");
  const mobileMenu = $("mobileMenu");

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
  // 4. MENÚ MÓVIL
  // ============================================

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

  // ============================================
  // 5. NOTIFICACIONES
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
      closeMobileMenu();
      closeNotifications();
    }
  });

  // ============================================
  // 6. DATOS DEMOSTRATIVOS
  // ============================================

  let nextId = 5;
  let activeId = 1;
  let selectedFile = null;

  let conversations = [
    {
      id: 1,
      title: "Cómo plantear el problema",
      date: "Hoy",
      messages: [
        {
          role: "ai",
          text:
            "¡Hola! Soy tu asesor de investigación de TesisLive.\n\n" +
            "Puedo ayudarte a delimitar tu tema, formular objetivos, " +
            "revisar tu metodología y comprender las observaciones " +
            "de tu trabajo académico."
        },
        {
          role: "user",
          text:
            "Ayúdame a formular el problema de investigación " +
            "sobre marketing digital en PYMES."
        },
        {
          role: "ai",
          text:
            "Empecemos por lo esencial. Para plantear un problema " +
            "de investigación necesitamos precisar tres cosas:\n\n" +
            "1. El fenómeno que deseas estudiar.\n" +
            "2. La población o el contexto de las PYMES.\n" +
            "3. El vacío de conocimiento que quieres abordar.\n\n" +
            "¿Ya tienes un sector, ciudad o tipo de empresa en mente?"
        }
      ]
    },
    {
      id: 2,
      title: "Metodología cuantitativa",
      date: "Ayer",
      messages: [
        {
          role: "user",
          text: "¿Cuándo debo utilizar metodología cuantitativa?"
        },
        {
          role: "ai",
          text:
            "El enfoque cuantitativo puede ser apropiado " +
            "cuando necesitas medir variables, comparar grupos " +
            "o analizar relaciones mediante datos numéricos.\n\n" +
            "Primero debemos revisar tus objetivos de investigación."
        }
      ]
    },
    {
      id: 3,
      title: "Revisión de literatura",
      date: "Hace 2 días",
      messages: [
        {
          role: "ai",
          text:
            "Una revisión de literatura no consiste únicamente " +
            "en reunir citas. También necesitas comparar " +
            "investigaciones, analizar sus resultados e identificar " +
            "brechas de conocimiento."
        }
      ]
    },
    {
      id: 4,
      title: "Citas y referencias APA",
      date: "Hace 3 días",
      messages: [
        {
          role: "ai",
          text:
            "Puedo orientarte en la organización de referencias APA. " +
            "Para hacerlo correctamente necesitaré los datos reales " +
            "de las fuentes que estás utilizando."
        }
      ]
    }
  ];

  const layout = $("advisorLayout");
  const chatList = $("conversationList");
  const messageContainer = $("messages");
  const scroller = $("messagesScroller");
  const messageInput = $("messageInput");

  const mobileHistory = window.matchMedia("(max-width: 650px)");

  function activeConversation() {
    return conversations.find(chat => chat.id === activeId);
  }

  // ============================================
  // 7. HISTORIAL CONTRAÍBLE
  // ============================================

  function setHistoryHidden(hidden) {
    layout.classList.toggle("history-hidden", hidden);

    $("openHistory").hidden = !hidden;
    $("newChatCollapsed").hidden = !hidden;

    $("panelToggle").setAttribute(
      "aria-label",
      hidden ? "Mostrar historial" : "Ocultar historial"
    );
  }

  $("panelToggle").addEventListener("click", () => {
    setHistoryHidden(true);
  });

  $("openHistory").addEventListener("click", () => {
    setHistoryHidden(false);
  });

  if (mobileHistory.matches) {
    setHistoryHidden(true);
  }

  mobileHistory.addEventListener("change", event => {
    setHistoryHidden(event.matches);
  });

  // ============================================
  // 8. LISTA DE CONVERSACIONES
  // ============================================

  function renderConversations() {
    chatList.replaceChildren();

    const search = $("searchChats").value.trim().toLowerCase();

    const filtered = conversations.filter(chat =>
      chat.title.toLowerCase().includes(search)
    );

    if (filtered.length === 0) {
      const empty = document.createElement("p");
      empty.className = "conversation-empty";
      empty.textContent = "No se encontraron conversaciones.";

      chatList.append(empty);
      return;
    }

    filtered.forEach(chat => {

      const item = document.createElement("div");
      item.className = "conversation-item";

      item.classList.toggle("active", chat.id === activeId);

      // BOTÓN DE SELECCIÓN
      const select = document.createElement("button");
      select.type = "button";
      select.className = "conversation-select";

      const title = document.createElement("strong");
      title.textContent = chat.title;

      const date = document.createElement("small");
      date.textContent = chat.date;

      select.append(title, date);

      select.addEventListener("click", () => {
        activeId = chat.id;

        renderConversations();
        renderMessages();

        if (mobileHistory.matches) {
          setHistoryHidden(true);
        }
      });

      // ACCIONES
      const actions = document.createElement("div");
      actions.className = "conversation-actions";

      // RENOMBRAR
      const rename = document.createElement("button");
      rename.type = "button";
      rename.title = "Renombrar";
      rename.setAttribute(
        "aria-label",
        `Renombrar ${chat.title}`
      );
      rename.append(createIcon("pencil"));

      rename.addEventListener("click", () => {
        const name = window.prompt(
          "Nuevo nombre de la conversación:",
          chat.title
        );

        if (name !== null && name.trim()) {
          chat.title = name.trim().slice(0, 80);

          renderConversations();
        }
      });

      // ELIMINAR
      const remove = document.createElement("button");
      remove.type = "button";
      remove.title = "Eliminar";
      remove.setAttribute(
        "aria-label",
        `Eliminar ${chat.title}`
      );
      remove.append(createIcon("trash-2"));

      remove.addEventListener("click", () => {
        const accepted = window.confirm(
          "¿Eliminar esta conversación de la demostración?"
        );

        if (!accepted) return;

        conversations = conversations.filter(
          current => current.id !== chat.id
        );

        if (activeId === chat.id) {
          activeId = conversations[0]?.id ?? null;
        }

        renderConversations();
        renderMessages();
      });

      actions.append(rename, remove);
      item.append(select, actions);

      chatList.append(item);
    });

    renderIcons();
  }

  $("searchChats").addEventListener("input", renderConversations);

  // ============================================
  // 9. NUEVA CONVERSACIÓN
  // ============================================

  function newConversation(focusInput = true) {
    const chat = {
      id: nextId++,
      title: "Nueva conversación",
      date: "Hoy",
      messages: []
    };

    conversations.unshift(chat);
    activeId = chat.id;

    $("searchChats").value = "";
    messageInput.value = "";

    clearAttachment();

    renderConversations();
    renderMessages();
    autoResize();

    if (mobileHistory.matches) {
      setHistoryHidden(true);
    }

    if (focusInput) {
      messageInput.focus();
    }

    return chat;
  }

  $("newChatButton").addEventListener("click", () => {
    newConversation();
  });

  $("newChatCollapsed").addEventListener("click", () => {
    newConversation();
  });

  // ============================================
  // 10. RENDERIZAR MENSAJES
  // ============================================

  function renderMessages() {
    messageContainer.replaceChildren();

    const chat = activeConversation();

    if (!chat || chat.messages.length === 0) {
      renderEmptyChat();
      return;
    }

    chat.messages.forEach(message => {

      const row = document.createElement("article");
      row.className = `message ${message.role}`;

      // AVATAR DEL ASESOR
      if (message.role === "ai") {
        const avatar = document.createElement("div");
        avatar.className = "message-avatar";

        const logo = document.createElement("img");
        logo.src = "assets/logo-icono.png";
        logo.alt = "";

        avatar.append(logo);
        row.append(avatar);
      }

      const content = document.createElement("div");
      content.className = "message-content";

      if (message.role === "ai") {
        const author = document.createElement("div");
        author.className = "message-author";
        author.textContent = "TesisLive";

        content.append(author);
      }

      // TEXTO DEL MENSAJE
      const text = document.createElement("div");
      text.className = "message-text";
      text.textContent = message.text;

      content.append(text);

      // ARCHIVO PDF ASOCIADO
      if (message.fileName) {
        const attachment = document.createElement("div");
        attachment.className = "message-attachment";

        attachment.append(createIcon("file-text"));

        const label = document.createElement("span");
        label.textContent = message.fileName;

        attachment.append(label);
        content.append(attachment);
      }

      // ACCIONES PARA RESPUESTAS IA
      if (message.role === "ai") {
        const actions = document.createElement("div");
        actions.className = "message-actions";

        // COPIAR
        const copy = document.createElement("button");
        copy.type = "button";
        copy.className = "message-action";

        copy.append(
          createIcon("copy"),
          document.createTextNode(" Copiar")
        );

        copy.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(message.text);
            showToast("Respuesta copiada.");
          } catch {
            showToast("No se pudo copiar la respuesta.");
          }
        });

        // MARCAR COMO ÚTIL
        const useful = document.createElement("button");
        useful.type = "button";
        useful.className = "message-action";
        useful.title = "Respuesta útil";
        useful.setAttribute("aria-label", "Respuesta útil");

        useful.classList.toggle("selected", !!message.useful);

        useful.setAttribute(
          "aria-pressed",
          String(!!message.useful)
        );

        useful.append(createIcon("thumbs-up"));

        useful.addEventListener("click", () => {
          message.useful = !message.useful;
          renderMessages();
        });

        actions.append(copy, useful);
        content.append(actions);
      }

      row.append(content);
      messageContainer.append(row);
    });

    renderIcons();
    scrollBottom();
  }

  // ============================================
  // 11. PANTALLA DE CONVERSACIÓN VACÍA
  // ============================================

  function renderEmptyChat() {
    const empty = document.createElement("div");
    empty.className = "empty-chat";

    empty.innerHTML = `
      <div class="empty-logo">
        <img src="assets/logo-icono.png" alt="">
      </div>

      <h2>¿En qué estás trabajando hoy?</h2>

      <p>
        Puedes preguntar sobre tus objetivos, metodología,
        estructura o cualquier duda relacionada con tu investigación.
      </p>

      <div class="suggestions"></div>
    `;

    const suggestions = [
      ["target", "Revisar mis objetivos"],
      ["book-open", "Orientación metodológica"],
      ["file-check-2", "Analizar mi avance"],
      ["lightbulb", "Delimitar mi tema"]
    ];

    const area = empty.querySelector(".suggestions");

    suggestions.forEach(([name, label]) => {

      const button = document.createElement("button");
      button.type = "button";
      button.className = "suggestion";

      const text = document.createElement("span");
      text.textContent = label;

      button.append(createIcon(name), text);

      button.addEventListener("click", () => {
        messageInput.value = label;
        autoResize();
        messageInput.focus();
      });

      area.append(button);
    });

    messageContainer.append(empty);

    renderIcons();
    scrollBottom();
  }

  function scrollBottom() {
    requestAnimationFrame(() => {
      scroller.scrollTop = scroller.scrollHeight;
    });
  }

  // ============================================
  // 12. RESPUESTAS SIMULADAS
  // ============================================

  function getDemoReply(text, hasFile) {
    const query = text.toLowerCase();

    if (hasFile) {
      return (
        "He recibido la referencia a tu documento PDF.\n\n" +
        "Esta es una demostración y todavía no puedo leer " +
        "ni analizar su contenido.\n\n" +
        "Cuando integremos el backend, podré ayudarte " +
        "a identificar observaciones por página y ofrecer " +
        "orientación para mejorar tu investigación."
      );
    }

    if (query.includes("objetivo")) {
      return (
        "Para revisar tus objetivos, necesitamos comprobar " +
        "tres aspectos:\n\n" +
        "1. Qué deseas investigar.\n" +
        "2. A quiénes o qué estudiarás.\n" +
        "3. Qué alcance tendrá tu investigación.\n\n" +
        "¿Podrías compartir tu objetivo actual para revisarlo juntos?"
      );
    }

    if (
      query.includes("metodolog") ||
      query.includes("cuantitativ") ||
      query.includes("cualitativ")
    ) {
      return (
        "La metodología depende de tu pregunta de investigación.\n\n" +
        "El enfoque cuantitativo permite medir variables " +
        "y analizar datos numéricos. El cualitativo ayuda " +
        "a comprender experiencias y perspectivas.\n\n" +
        "¿Qué fenómeno deseas estudiar?"
      );
    }

    if (
      query.includes("problema") ||
      query.includes("tema") ||
      query.includes("delimitar")
    ) {
      return (
        "Para delimitar un problema de investigación, " +
        "identifica el fenómeno, la población, el contexto " +
        "y el periodo de estudio.\n\n" +
        "¿Qué tema tienes en mente y qué aspecto específico " +
        "te interesa investigar?"
      );
    }

    if (
      query.includes("apa") ||
      query.includes("cita") ||
      query.includes("referencia")
    ) {
      return (
        "Para revisar una cita o referencia necesito " +
        "los datos reales de la fuente.\n\n" +
        "Puedo orientarte con el formato APA, pero no " +
        "inventaré autores, fechas ni referencias bibliográficas."
      );
    }

    return (
      "Podemos trabajar esa consulta paso a paso.\n\n" +
      "Para orientarte mejor, cuéntame cuál es el tema " +
      "de tu investigación, en qué etapa te encuentras " +
      "y qué dificultad estás intentando resolver."
    );
  }

  // ============================================
  // 13. ARCHIVOS PDF
  // ============================================

  function clearAttachment() {
    selectedFile = null;

    $("fileInput").value = "";
    $("attachmentPreview").hidden = true;
  }

  $("attachButton").addEventListener("click", () => {
    $("fileInput").click();
  });

  $("removeAttachment").addEventListener(
    "click",
    clearAttachment
  );

  $("fileInput").addEventListener("change", event => {
    const file = event.target.files[0];

    if (!file) return;

    const filename = file.name.toLowerCase();

    const isPdf =
      filename.endsWith(".pdf") &&
      (!file.type || file.type === "application/pdf");

    if (!isPdf) {
      clearAttachment();
      showToast("Selecciona un archivo PDF válido.");
      return;
    }

    const maxSize = 20 * 1024 * 1024;

    if (file.size > maxSize) {
      clearAttachment();
      showToast("El archivo supera el límite de 20 MB.");
      return;
    }

    selectedFile = file;

    $("attachmentName").textContent = file.name;

    $("attachmentSize").textContent =
      (file.size / (1024 * 1024)).toFixed(2) + " MB";

    $("attachmentPreview").hidden = false;
  });

  // ============================================
  // 14. ÁREA DE ESCRITURA
  // ============================================

  function autoResize() {
    messageInput.style.height = "auto";

    messageInput.style.height =
      Math.min(messageInput.scrollHeight, 150) + "px";
  }

  messageInput.addEventListener("input", autoResize);

  messageInput.addEventListener("keydown", event => {

    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.isComposing
    ) {
      event.preventDefault();
      $("messageForm").requestSubmit();
    }
  });

  // ============================================
  // 15. ENVIAR MENSAJES
  // ============================================

  $("messageForm").addEventListener("submit", event => {
    event.preventDefault();

    const text = messageInput.value.trim();

    if (!text && !selectedFile) {
      return;
    }

    // Conservar el borrador antes de crear una
    // conversación cuando no existe ninguna activa.
    const fileName = selectedFile?.name ?? null;
    const hasFile = Boolean(selectedFile);
    const messageText = text || "Quiero revisar este documento.";

    let chat = activeConversation();

    if (!chat) {
      chat = newConversation(false);
    }

    // REGISTRAR MENSAJE DEL ESTUDIANTE
    chat.messages.push({
      role: "user",
      text: messageText,
      fileName
    });

    // TITULAR LA CONVERSACIÓN
    if (chat.title === "Nueva conversación") {
      chat.title = (
        text ||
        fileName ||
        "Consulta académica"
      ).slice(0, 48);
    }

    chat.date = "Hoy";

    // RESPUESTA SIMULADA
    const reply = getDemoReply(messageText, hasFile);

    chat.messages.push({
      role: "ai",
      text: reply
    });

    // El documento no se lee ni se envía.
    clearAttachment();

    messageInput.value = "";
    autoResize();

    $("searchChats").value = "";

    renderConversations();
    renderMessages();
  });

  // ============================================
  // 16. INICIALIZACIÓN
  // ============================================

  renderConversations();
  renderMessages();
  renderIcons();

});
