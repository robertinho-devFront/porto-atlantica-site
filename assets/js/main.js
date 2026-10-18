/* Porto Atlântica — script unique, sans dépendance (~3 Ko) */
(function () {
  "use strict";

  /* ---------- Mesure : événements poussés vers dataLayer / gtag si présents ---------- */
  function track(event, payload) {
    var data = Object.assign({ event: event, event_category: "conversion" }, payload || {});
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
    if (typeof window.gtag === "function") window.gtag("event", event, payload || {});
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-track]");
    if (el) track(el.getAttribute("data-track"), { location: el.getAttribute("data-location") || "" });
  });

  /* ---------- Année du footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });

  /* ---------- Header : bordure au scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 12); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("menu-mobile");
  if (toggle && menu) {
    var setOpen = function (open) {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      toggle.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu");
    };
    toggle.addEventListener("click", function () { setOpen(menu.hidden); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
  }

  /* ---------- Apparition des sections au scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduce) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Formulaire de contact ---------- */
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = form.querySelector(".form-status");
  var success = document.querySelector(".form-success");
  var submit = form.querySelector('button[type="submit"]');
  var started = false;

  var MESSAGES = {
    valueMissing: "Ce champ est obligatoire.",
    typeMismatch: "Indiquez une adresse email valide, par exemple nom@entreprise.fr.",
    consent: "Merci de cocher la case pour que nous puissions vous répondre."
  };

  function fieldError(input) {
    if (input.validity.valid) return "";
    if (input.type === "checkbox") return MESSAGES.consent;
    if (input.validity.typeMismatch) return MESSAGES.typeMismatch;
    return MESSAGES.valueMissing;
  }

  function showError(input) {
    var msg = fieldError(input);
    var out = document.getElementById(input.id + "-err");
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (out) out.textContent = msg;
    return !msg;
  }

  form.addEventListener("focusin", function () {
    if (!started) { started = true; track("contact_form_start", { form: "contact" }); }
  });
  // Validation à la sortie du champ : l'erreur apparaît au bon moment, pas pendant la saisie
  form.addEventListener("focusout", function (e) {
    if (e.target.required && e.target.value) showError(e.target);
  });
  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid") === "true") showError(e.target);
  });

  function mailtoFallback(data) {
    var email = form.getAttribute("data-email");
    var lines = [];
    data.forEach(function (v, k) { if (k.charAt(0) !== "_" && v) lines.push(k + " : " + v); });
    return "mailto:" + email + "?subject=" + encodeURIComponent("Demande d'étude — Porto Atlântica") +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    var required = Array.prototype.slice.call(form.querySelectorAll("[required]"));
    var firstInvalid = null;
    required.forEach(function (input) { if (!showError(input) && !firstInvalid) firstInvalid = input; });
    if (firstInvalid) {
      track("contact_form_error", { form: "contact", reason: firstInvalid.name });
      firstInvalid.focus();
      return;
    }

    var data = new FormData(form);
    if (data.get("_honey")) return; // robot

    var meta = { form: "contact", besoin: data.get("besoin") || "", secteur: data.get("secteur") || "" };
    track("contact_form_submit", meta);
    submit.disabled = true;
    submit.textContent = "Envoi en cours…";

    fetch(form.getAttribute("data-endpoint"), {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data
    })
      .then(function (res) { return res.json().then(function (json) { return { ok: res.ok, json: json }; }); })
      .then(function (r) {
        if (!r.ok || String(r.json.success) === "false") throw new Error(r.json.message || "Erreur d'envoi");
        track("contact_form_success", meta);
        form.hidden = true;
        success.hidden = false;
        success.focus();
      })
      .catch(function () {
        track("contact_form_error", Object.assign({ reason: "network" }, meta));
        status.className = "form-status form-status--error";
        status.innerHTML = "L'envoi n'a pas abouti. Vos informations ne sont pas perdues : " +
          '<a href="' + mailtoFallback(data) + '">envoyez-les par email en un clic</a>.';
        submit.disabled = false;
        submit.textContent = "Recevoir mon étude gratuite";
      });
  });
})();
