import React, { useState } from "react";
import { CalendarDays } from "lucide-react";
import { ConfettiBurst, DateField, EventTypeSelect, Field } from "../booking";
import { eventTypes } from "../../constants";
import { formatBookingMessage } from "../../utils";

export default function BookingSection() {
  const [formData, setFormData] = useState({
    name: "",
    eventDate: "",
    eventType: eventTypes[0],
    contactMethod: "phone",
    contactValue: "",
    projectDetails: "",
  });
  const [formStatus, setFormStatus] = useState("idle");
  const [formMessage, setFormMessage] = useState("");
  const isSubmitting = formStatus === "submitting";

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (formMessage) {
      setFormMessage("");
      setFormStatus("idle");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: formData.name.trim(),
      eventDate: formData.eventDate.trim(),
      eventType: formData.eventType.trim(),
      contactMethod: formData.contactMethod,
      contactValue: formData.contactValue.trim(),
      projectDetails: formData.projectDetails.trim(),
    };

    if (Object.values(payload).some((value) => !value)) {
      setFormStatus("error");
      setFormMessage("Please fill in every field before submitting.");
      return;
    }

    if (
      payload.contactMethod === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.contactValue)
    ) {
      setFormStatus("error");
      setFormMessage("Please enter a valid email address.");
      return;
    }

    if (payload.contactMethod !== "email" && payload.contactValue.length < 6) {
      setFormStatus("error");
      setFormMessage("Please enter a valid phone number.");
      return;
    }

    setFormStatus("submitting");
    setFormMessage("");

    try {
      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        throw new Error("Telegram is not configured.");
      }

      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: formatBookingMessage(payload).slice(0, 4096),
            disable_web_page_preview: true,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Booking alert failed.");
      }

      setFormData({
        name: "",
        eventDate: "",
        eventType: eventTypes[0],
        contactMethod: "phone",
        contactValue: "",
        projectDetails: "",
      });
      setFormStatus("success");
      setFormMessage("Inquiry sent. We will get back to you soon.");
    } catch {
      setFormStatus("error");
      setFormMessage("Unable to send inquiry right now. Please try again.");
    }
  };

  return (
    <section className="booking-section section-shell" id="booking">
      {formStatus === "success" && <ConfettiBurst />}
      <div className="relative mx-auto max-w-5xl overflow-visible px-2 py-5 text-center md:py-8">
        <span className="booking-kicker mb-2">Concierge Services</span>
        <h2 className="text-2xl mx-auto flex w-fit max-w-full items-center justify-center gap-2 text-left sm:gap-3">
          <CalendarDays
            size={28}
            className="shrink-0 text-primary"
            aria-hidden="true"
          />
          <span className="block leading-tight">Reserve the Experience</span>
        </h2>
        <p className="booking-subtitle">
          Connect with our team to design the sonic landscape for your upcoming
          event.
        </p>
        <form
          className="booking-form-panel mx-auto mt-10 text-left"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
            <Field
              label="Full Name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
            <EventTypeSelect
              value={formData.eventType}
              onChange={(value) => updateField("eventType", value)}
            />
            <DateField
              label="Event Date"
              value={formData.eventDate}
              onChange={(value) => updateField("eventDate", value)}
            />
            <label className="block space-y-2">
              <span className="label-caps text-on-surface-variant">
                Contact Option
              </span>
              <div className="contact-method-toggle">
                {[
                  ["phone", "Phone"],
                  ["email", "Email"],
                ].map(([method, label]) => (
                  <button
                    className={`contact-method-button ${
                      formData.contactMethod === method ? "active" : ""
                    }`}
                    type="button"
                    key={method}
                    onClick={() => {
                      updateField("contactMethod", method);
                      updateField("contactValue", "");
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </label>
          </div>
          <Field
            label={
              formData.contactMethod === "email"
                ? "Email Address"
                : "Phone Number"
            }
            placeholder={
              formData.contactMethod === "email"
                ? "you@example.com"
                : "+00 00000 00000"
            }
            type={formData.contactMethod === "email" ? "email" : "tel"}
            value={formData.contactValue}
            onChange={(event) =>
              updateField("contactValue", event.target.value)
            }
          />
          <label className="block space-y-2">
            <span className="label-caps text-on-surface-variant">
              Event Details
            </span>
            <textarea
              className="form-field min-h-28 resize-none"
              placeholder="Tell us about your vision, venue, and date..."
              value={formData.projectDetails}
              onChange={(event) =>
                updateField("projectDetails", event.target.value)
              }
            />
          </label>
          {formMessage && (
            <p
              className={`text-center text-sm font-semibold ${
                formStatus === "success"
                  ? "text-primary-container"
                  : "text-primary"
              }`}
              role="status"
            >
              {formMessage}
            </p>
          )}
          <div className="booking-form-footer">
            <span className="booking-quick-connect">
              {formData.contactMethod === "email"
                ? "Email quick connect"
                : "WhatsApp quick connect"}
            </span>
            <button
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
