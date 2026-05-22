"use client";

import { useState } from "react";

interface SubjectOption {
  value: string;
  label: string;
}

type Status = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const fieldClass =
  "w-full border-none bg-[#d8d8d8] px-4 py-3.5 text-text-dark placeholder:text-text-dark-40 focus:outline-none";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function ContactForm({
  heading,
  description,
  subjectOptions,
}: {
  heading: string;
  description: string;
  subjectOptions: SubjectOption[];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "");
    const message = String(data.get("message") ?? "").trim();

    const next: FieldErrors = {};
    if (!name) next.name = "Please enter your name.";
    if (!EMAIL_RE.test(email)) next.email = "Please enter a valid email address.";
    if (!message) next.message = "Please enter a message.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const json = (await res.json()) as { success?: boolean };
      setStatus(res.ok && json.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div>
        <p className="mb-2 text-text-dark">{heading}</p>
        <p className="leading-[1.4] text-text-dark-70">
          Thanks — your message is on its way. I&rsquo;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <p className="mb-4 text-text-dark">{heading}</p>
      {description && (
        <p className="mb-8 font-normal leading-[1.4] text-text-dark-70">
          {description}
        </p>
      )}

      <div className="mb-4">
        <input
          name="name"
          type="text"
          placeholder="Name"
          aria-label="Name"
          className={fieldClass}
        />
        {errors.name && (
          <p className="mt-1 text-canvas-red">{errors.name}</p>
        )}
      </div>

      <div className="mb-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          aria-label="Email"
          className={fieldClass}
        />
        {errors.email && (
          <p className="mt-1 text-canvas-red">{errors.email}</p>
        )}
      </div>

      {subjectOptions.length > 0 && (
        <div className="mb-4">
          <select
            name="subject"
            aria-label="Subject"
            defaultValue={subjectOptions[0].value}
            className={fieldClass}
          >
            {subjectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4">
        <textarea
          name="message"
          placeholder="Message"
          aria-label="Message"
          rows={6}
          className={`${fieldClass} min-h-[160px] resize-y`}
        />
        {errors.message && (
          <p className="mt-1 text-canvas-red">{errors.message}</p>
        )}
      </div>

      {status === "error" && (
        <p className="mb-2 text-canvas-red">
          Something went wrong sending your message. Please try again, or email
          directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-4 font-bold text-text-dark underline transition-opacity duration-[var(--duration-fast)] ease-out hover:opacity-60 disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
