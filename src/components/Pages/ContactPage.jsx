import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { pageTitle } from "../../helper";
import Div from "../Div";
import PageHeading from "../PageHeading";
import SectionHeading from "../SectionHeading";
import Spacing from "../Spacing";
import ContactInfoWidget from "../Widget/ContactInfoWidget";

/**
 * Read env vars safely at runtime.
 * Priority: window.ENV -> process.env -> fallback
 * Always .trim() to remove stray spaces from env config.
 */
function readEnv(name, fallback = "") {
  const fromWindow =
    typeof window !== "undefined" &&
    window.ENV &&
    typeof window.ENV[name] === "string"
      ? window.ENV[name]
      : null;

  const fromProcess =
    typeof process !== "undefined" &&
    process.env &&
    typeof process.env[name] === "string"
      ? process.env[name]
      : null;

  return (fromWindow ?? fromProcess ?? fallback).toString().trim();
}

// EmailJS configuration (trimmed)
const PUB_KEY   = readEnv("REACT_APP_EMAILJS_PUBLIC_KEY");
const SERVICEID = readEnv("REACT_APP_EMAILJS_SERVICE_ID");
const TEMPLATEID= readEnv("REACT_APP_EMAILJS_TEMPLATE_ID");

export default function ContactPage() {
  pageTitle("Nous contacter");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    projectType: "",
    mobile: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ type: "idle", msg: "" });

  useEffect(() => {
    try {
      if (PUB_KEY) {
        // Init EmailJS once
        emailjs.init({ publicKey: PUB_KEY });
        // Masked debug logs (utile pour diagnostiquer sans exposer la clé)
        const masked =
          PUB_KEY.length >= 6 ? `${PUB_KEY.slice(0,3)}…${PUB_KEY.slice(-3)}` : "(short)";
        console.log("EmailJS init OK – key:", masked);
        console.log("EmailJS service/template:", SERVICEID || "(none)", TEMPLATEID || "(none)");
      } else {
        console.warn("EmailJS: public key manquante (REACT_APP_EMAILJS_PUBLIC_KEY).");
      }
    } catch (e) {
      console.error("EmailJS init error:", e);
    }
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "idle", msg: "" });

    // Front guards
    if (!SERVICEID || !TEMPLATEID || !PUB_KEY) {
      console.error("EmailJS config manquante:", {
        SERVICEID,
        TEMPLATEID,
        PUB_KEY: !!PUB_KEY,
      });
      setStatus({
        type: "error",
        msg: "❌ Configuration EmailJS incomplète. Vérifie les variables (public key / service / template).",
      });
      return;
    }

    setIsSending(true);
    const templateParams = {
      from_name: (formData.fullName || "").trim(),
      from_email: (formData.email || "").trim(), // <-- recommandé par EmailJS
      project_type: (formData.projectType || "").trim(),
      phone: (formData.mobile || "").trim(),
      subject: (formData.projectType || "Nouveau message depuis le site").trim(),
      message: (formData.message || "").trim(),
    };

    try {
      const res = await emailjs.send(SERVICEID, TEMPLATEID, templateParams);
      if (res?.status === 200) {
        setStatus({ type: "success", msg: "✅ Message envoyé avec succès !" });
        setFormData({ fullName: "", email: "", projectType: "", mobile: "", message: "" });
      } else {
        setStatus({
          type: "error",
          msg: `❌ Erreur EmailJS (${res?.status || "inconnue"}).`,
        });
      }
    } catch (err) {
      const txt = err?.text || err?.message || "Erreur inconnue EmailJS.";
      setStatus({ type: "error", msg: `❌ ${txt}` });
      console.error("Erreur lors de l'envoi :", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <PageHeading title="Nous contacter" bgSrc="/images/contact_hero_bg.jpg" pageLinkText="Contact" />
      <Spacing lg="150" md="80" />
      <Div className="container">
        <Div className="row">
          <Div className="col-lg-6">
            <SectionHeading title="Avez-vous un projet <br/>en tête?" subtitle="Contactez-nous" />
            <Spacing lg="55" md="30" />
            <ContactInfoWidget withIcon />
            <Spacing lg="0" md="50" />
          </Div>

          <Div className="col-lg-6">
            <form onSubmit={onSubmit} className="row" noValidate>
              <Div className="col-sm-6">
                <label className="cs-primary_color">Prénom et Nom*</label>
                <input
                  type="text"
                  name="fullName"
                  className="cs-form_field"
                  value={formData.fullName}
                  onChange={onChange}
                  required
                />
                <Spacing lg="20" md="20" />
              </Div>

              <Div className="col-sm-6">
                <label className="cs-primary_color">Email*</label>
                <input
                  type="email"
                  name="email"
                  className="cs-form_field"
                  value={formData.email}
                  onChange={onChange}
                  required
                />
                <Spacing lg="20" md="20" />
              </Div>

              <Div className="col-sm-6">
                <label className="cs-primary_color">Type de projet*</label>
                <input
                  type="text"
                  name="projectType"
                  className="cs-form_field"
                  value={formData.projectType}
                  onChange={onChange}
                  required
                />
                <Spacing lg="20" md="20" />
              </Div>

              <Div className="col-sm-6">
                <label className="cs-primary_color">Mobile*</label>
                <input
                  type="tel"
                  name="mobile"
                  className="cs-form_field"
                  value={formData.mobile}
                  onChange={onChange}
                  required
                />
                <Spacing lg="20" md="20" />
              </Div>

              <Div className="col-sm-12">
                <label className="cs-primary_color">Message*</label>
                <textarea
                  name="message"
                  cols="30"
                  rows="7"
                  className="cs-form_field"
                  value={formData.message}
                  onChange={onChange}
                  required
                />
                <Spacing lg="25" md="25" />
              </Div>

              <Div className="col-sm-12">
                <button type="submit" className="cs-btn cs-style1" disabled={isSending}>
                  <span>{isSending ? "Envoi en cours…" : "Envoyer le message"}</span>
                  <Icon icon="bi:arrow-right" />
                </button>
              </Div>

              {status.msg && (
                <Div className="col-sm-12">
                  <p
                    style={{
                      color: status.type === "error" ? "red" : "#1e7e34",
                      marginTop: "10px",
                      fontWeight: 600,
                    }}
                  >
                    {status.msg}
                  </p>
                </Div>
              )}
            </form>
          </Div>
        </Div>
      </Div>

      <Spacing lg="150" md="80" />
      <Div className="cs-google_map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2913.8621130634433!2d2.2254321986985675!3d43.086394158707854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12afcd5b7658ca65%3A0x83fb1df70881ad99!2sLa%20Flamme%20Limouxine!5e0!3m2!1sen!2sfr!4v1701859661139!5m2!1sen!2sfr"
          allowFullScreen
          title="Google Map"
        />
      </Div>
    </>
  );
}