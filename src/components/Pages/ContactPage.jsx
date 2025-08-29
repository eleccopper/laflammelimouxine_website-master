import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { pageTitle } from "../../helper";
import Div from "../Div";
import PageHeading from "../PageHeading";
import SectionHeading from "../SectionHeading";
import Spacing from "../Spacing";
import ContactInfoWidget from "../Widget/ContactInfoWidget";

// Normalize & trim EmailJS env vars to avoid accidental spaces from Heroku config
const rawPUB = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "";
const rawSID = process.env.REACT_APP_EMAILJS_SERVICE_ID || "";
const rawTID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "";
const PUB_KEY = rawPUB.trim();
const SERVICEID = rawSID.trim();
const TEMPLATEID = rawTID.trim();

export default function ContactPage() {
  pageTitle("Nous contacter");

  useEffect(() => {
    try {
      if (PUB_KEY) {
        emailjs.init({ publicKey: PUB_KEY });
      } else {
        console.warn("EmailJS: public key manquante (REACT_APP_EMAILJS_PUBLIC_KEY).");
      }
    } catch (e) {
      console.error("EmailJS init error:", e);
    }
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    projectType: "",
    mobile: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("");
    if (!SERVICEID || !TEMPLATEID || !PUB_KEY) {
      console.error("EmailJS config manquante:", { SERVICEID, TEMPLATEID, PUB_KEY: !!PUB_KEY });
      setStatus("❌ Configuration EmailJS manquante côté front (service, template ou clé publique).");
      return;
    }
    console.log("Formulaire soumis :", formData);

    emailjs
      .send(
        SERVICEID,
        TEMPLATEID,
        {
          from_name: formData.fullName,
          reply_to: formData.email,
          project_type: formData.projectType,
          phone: formData.mobile,
          message: formData.message,
        }
      )
      .then((response) => {
        console.log("Email envoyé :", response);
        setStatus("✅ Message envoyé avec succès !");
        setFormData({ fullName: "", email: "", projectType: "", mobile: "", message: "" });
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi :", error?.text || error?.message || error);
        setStatus("❌ Erreur lors de l'envoi du message. Veuillez réessayer.");
      });
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
            <form onSubmit={handleSubmit} className="row">
              <Div className="col-sm-6">
                <label className="cs-primary_color">Prénom et Nom*</label>
                <input type="text" name="fullName" className="cs-form_field" value={formData.fullName} onChange={handleChange} required />
                <Spacing lg="20" md="20" />
              </Div>
              <Div className="col-sm-6">
                <label className="cs-primary_color">Email*</label>
                <input type="email" name="email" className="cs-form_field" value={formData.email} onChange={handleChange} required />
                <Spacing lg="20" md="20" />
              </Div>
              <Div className="col-sm-6">
                <label className="cs-primary_color">Type de projet*</label>
                <input type="text" name="projectType" className="cs-form_field" value={formData.projectType} onChange={handleChange} required />
                <Spacing lg="20" md="20" />
              </Div>
              <Div className="col-sm-6">
                <label className="cs-primary_color">Mobile*</label>
                <input type="tel" name="mobile" className="cs-form_field" value={formData.mobile} onChange={handleChange} required />
                <Spacing lg="20" md="20" />
              </Div>
              <Div className="col-sm-12">
                <label className="cs-primary_color">Message*</label>
                <textarea name="message" cols="30" rows="7" className="cs-form_field" value={formData.message} onChange={handleChange} required></textarea>
                <Spacing lg="25" md="25" />
              </Div>
              <Div className="col-sm-12">
                <button type="submit" className="cs-btn cs-style1">
                  <span>Envoyer le message</span>
                  <Icon icon="bi:arrow-right" />
                </button>
              </Div>
              {status && (
                <Div className="col-sm-12">
                  <p style={{ color: status.includes("❌") ? "red" : "green", marginTop: "10px" }}>{status}</p>
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