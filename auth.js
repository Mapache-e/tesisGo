const DEMO_MODE = true;

if (DEMO_MODE) {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  if (registerForm) {
    registerForm.noValidate = true;

    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      window.location.href = "login.html";
    }, { capture: true });
  }

  if (loginForm) {
    loginForm.noValidate = true;

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      window.location.href = "dashboard.html";
    }, { capture: true });
  }
}



document.addEventListener("DOMContentLoaded", () => {

  // ============================================
  // CONFIGURACIÓN
  // ============================================

  // Regla provisional para el prototipo.
  // En producción se usará una lista de dominios
  // oficiales por universidad, verificada en backend.
  const INSTITUTIONAL_DOMAIN = /\.edu\.pe$/i;

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================

  function getField(id) {
    return document.getElementById(id);
  }

  function showError(fieldId, message) {
    const input = getField(fieldId);
    const error = getField(fieldId + "Error");

    if (input) {
      input.classList.add("input-error");
      input.setAttribute("aria-invalid", "true");
    }

    if (error) {
      error.textContent = message;
    }
  }

  function clearError(fieldId) {
    const input = getField(fieldId);
    const error = getField(fieldId + "Error");

    if (input) {
      input.classList.remove("input-error");
      input.removeAttribute("aria-invalid");
    }

    if (error) {
      error.textContent = "";
    }
  }

  function clearAllErrors(form) {
    form.querySelectorAll(".input-error").forEach(input => {
      input.classList.remove("input-error");
      input.removeAttribute("aria-invalid");
    });

    form.querySelectorAll(".field-error").forEach(error => {
      error.textContent = "";
    });
  }

  function showStatus(id, message, isError = false) {
    const element = getField(id);
    if (!element) return;

    element.textContent = message;
    element.classList.toggle("status-error", isError);
    element.hidden = false;
  }

  function hideStatus(id) {
    const element = getField(id);
    if (element) {
      element.hidden = true;
      element.textContent = "";
    }
  }

  function isValidInstitutionalEmail(email) {
    const normalized = email.trim().toLowerCase();
    const parts = normalized.split("@");

    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return false;
    }

    return INSTITUTIONAL_DOMAIN.test(parts[1]);
  }

  function normalizePhone(value) {
    return value.replace(/[\s()-]/g, "");
  }

  // Celulares peruanos: 9 dígitos que empiezan por 9.
  // Acepta 999999999 o +51999999999.
  function isValidPhone(value) {
    const phone = normalizePhone(value);
    return /^(?:\+51)?9\d{8}$/.test(phone);
  }

  // ============================================
  // MOSTRAR Y OCULTAR CONTRASEÑAS
  // ============================================

  document.querySelectorAll(".password-toggle")
    .forEach(button => {

      button.addEventListener("click", () => {
        const targetId = button.dataset.target;
        const input = getField(targetId);

        if (!input) return;

        const isHidden = input.type === "password";

        input.type = isHidden ? "text" : "password";

        button.setAttribute(
          "aria-label",
          isHidden ? "Ocultar contraseña" : "Mostrar contraseña"
        );

        button.setAttribute(
          "aria-pressed",
          String(isHidden)
        );

        button.style.color = isHidden
          ? "var(--green-dark)"
          : "";
      });

    });

  // ============================================
  // VALIDACIÓN DE REGISTRO
  // ============================================

  const registerForm = getField("registerForm");

  if (registerForm) {

    const universitySelect = getField("universidad");
    const otherUniversityGroup = getField("otraUniversidadGroup");
    const otherUniversity = getField("otraUniversidad");

    // Mostrar campo de otra universidad
    if (universitySelect) {
      universitySelect.addEventListener("change", () => {
        const isOther = universitySelect.value === "OTRA";

        if (otherUniversityGroup) {
          otherUniversityGroup.hidden = !isOther;
        }

        if (otherUniversity) {
          otherUniversity.required = isOther;

          if (!isOther) {
            otherUniversity.value = "";
            clearError("otraUniversidad");
          }
        }

        clearError("universidad");
      });
    }

    // Detectar si el estudiante eligió Pro.
    const params = new URLSearchParams(window.location.search);

    const selectedPlan = params.get("plan");
    const selectedTrial = params.get("trial");

    const trialNotice = getField("trialNotice");

    if (
      selectedPlan === "pro" &&
      selectedTrial === "7" &&
      trialNotice
    ) {
      trialNotice.hidden = false;
    }

    // Limpiar errores al editar
    registerForm.querySelectorAll("input, select")
      .forEach(input => {
        const eventName = input.tagName === "SELECT"
          ? "change"
          : "input";

        input.addEventListener(eventName, () => {
          if (input.id) {
            clearError(input.id);
          }

          hideStatus("registerStatus");

          if (
            input.id === "password" ||
            input.id === "confirmPassword"
          ) {
            clearError("confirmPassword");
          }
        });
      });

    registerForm.addEventListener("submit", event => {
      event.preventDefault();

      clearAllErrors(registerForm);
      hideStatus("registerStatus");

      const nombre = getField("nombre").value.trim();
      const apellido = getField("apellido").value.trim();
      const correo = getField("correo").value.trim();
      const password = getField("password").value;
      const confirmPassword = getField("confirmPassword").value;
      const universidad = getField("universidad").value;
      const telefono = getField("telefono").value.trim();

      let isValid = true;
      let firstInvalidId = null;

      function fail(fieldId, message) {
        showError(fieldId, message);
        if (!firstInvalidId) firstInvalidId = fieldId;
        isValid = false;
      }

      if (nombre.length < 2) {
        fail("nombre", "Ingresa un nombre válido.");
      }

      if (apellido.length < 2) {
        fail("apellido", "Ingresa tu apellido.");
      }

      if (!isValidInstitutionalEmail(correo)) {
        fail(
          "correo",
          "Para esta prueba utiliza un correo institucional .edu.pe."
        );
      }

      if (password.length < 8) {
        fail(
          "password",
          "La contraseña debe tener al menos 8 caracteres."
        );
      }

      if (!confirmPassword) {
        fail(
          "confirmPassword",
          "Confirma tu contraseña."
        );
      } else if (password !== confirmPassword) {
        fail(
          "confirmPassword",
          "Las contraseñas no coinciden."
        );
      }

      if (!universidad) {
        fail(
          "universidad",
          "Selecciona tu universidad."
        );
      }

      if (universidad === "OTRA") {
        const otherName = otherUniversity.value.trim();

        if (otherName.length < 3) {
          fail(
            "otraUniversidad",
            "Escribe el nombre de tu universidad."
          );
        }
      }

      if (!isValidPhone(telefono)) {
        fail(
          "telefono",
          "Ingresa un celular peruano válido de 9 dígitos."
        );
      }

      if (!isValid) {
        getField(firstInvalidId)?.focus();
        return;
      }

      // ========================================
      // FUTURA CONEXIÓN CON SPRING BOOT
      // ========================================
      //
      // Cuando conectemos la API:
      //
      // 1. Enviar los datos al backend mediante
      //    una solicitud POST sobre HTTPS.
      // 2. Verificar dominio y universidad.
      // 3. Enviar un enlace de verificación al correo.
      // 4. Crear la cuenta cuando se confirme.
      // 5. Activar la prueba Pro, si corresponde.
      //
      // No guardamos contraseñas en localStorage.
      // No fingimos que la cuenta ya se creó.

      showStatus(
        "registerStatus",
        "Formulario validado correctamente. Esta es una demostración: el registro real estará disponible cuando conectemos el servidor."
      );

      console.info("Formulario de registro validado (sin envío).");
    });
  }

  // ============================================
  // VALIDACIÓN DE LOGIN
  // ============================================

  const loginForm = getField("loginForm");

  if (loginForm) {

    loginForm.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", () => {
        clearError(input.id);
        hideStatus("loginStatus");
      });
    });

    loginForm.addEventListener("submit", event => {
      event.preventDefault();

      clearAllErrors(loginForm);
      hideStatus("loginStatus");

      const correo = getField("loginCorreo").value.trim();
      const password = getField("loginPassword").value;

      let isValid = true;

      if (!isValidInstitutionalEmail(correo)) {
        showError(
          "loginCorreo",
          "Ingresa un correo institucional válido."
        );
        isValid = false;
      }

      if (!password) {
        showError(
          "loginPassword",
          "Ingresa tu contraseña."
        );
        isValid = false;
      }

      if (!isValid) return;

      showStatus(
        "loginStatus",
        "Formulario validado. El inicio de sesión estará disponible cuando conectemos la autenticación de TesisLive."
      );

      // Integración futura:
      // POST /api/auth/login
      // Conexión segura con Spring Boot.
    });

    const forgotPassword = getField("forgotPassword");

    if (forgotPassword) {
      forgotPassword.addEventListener("click", event => {
        event.preventDefault();

        showStatus(
          "loginStatus",
          "La recuperación de contraseña estará disponible cuando conectemos el servicio de correo."
        );
      });
    }
  }

});
