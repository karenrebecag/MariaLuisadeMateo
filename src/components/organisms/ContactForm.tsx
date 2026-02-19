"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Heading, Text } from "@/src/components/atoms/Typography";
import { Divider } from "@/src/components/atoms/Divider";
import { useSplitReveal } from "@/src/hooks/useSplitReveal";
import { cn } from "@/lib/utils";

interface FieldState {
  value: string;
  touched: boolean;
  valid: boolean;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ContactForm() {
  const sectionRef = useSplitReveal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const [fields, setFields] = useState<Record<string, FieldState>>({
    name: { value: "", touched: false, valid: false },
    email: { value: "", touched: false, valid: false },
    subject: { value: "", touched: false, valid: false },
    message: { value: "", touched: false, valid: false },
  });

  const [submitted, setSubmitted] = useState(false);

  const updateField = (name: string, value: string) => {
    let valid = value.trim().length > 0;
    if (name === "email") valid = validateEmail(value);
    if (name === "message") valid = value.trim().length >= 10;

    setFields((prev) => ({
      ...prev,
      [name]: { value, touched: true, valid },
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const updated = { ...fields };
    let allValid = true;
    for (const key of Object.keys(updated)) {
      updated[key].touched = true;
      if (!updated[key].valid) allValid = false;
    }
    setFields(updated);

    if (allValid) {
      setSubmitted(true);
    }
  };

  const getFieldClasses = (name: string) => {
    const field = fields[name];
    if (!field.touched) return "border-border/60";
    if (field.valid) return "border-success/40";
    return "border-destructive";
  };

  const inputBase =
    "w-full border-b bg-transparent px-0 py-4 text-foreground outline-none transition-colors duration-300 placeholder:text-muted-foreground/40 focus:border-foreground";

  if (!mounted) {
    return <section id="contact" className="section-padding" />;
  }

  if (submitted) {
    return (
      <section id="contact" className="section-padding">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-success/10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-8 text-success">
              <path d="M11.25 14.25L9 12" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 10.5L11.25 14.25" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <Heading as="h3" className="mt-6">
            Mensaje enviado
          </Heading>
          <Text className="mt-4">
            Gracias por tu mensaje. Te responderemos a la brevedad.
          </Text>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-padding">
      <div ref={sectionRef} className="max-width">
        <Divider className="mb-16 md:mb-20" />

        <div className="grid gap-16 md:grid-cols-2 md:gap-20">
          {/* Left column — heading & info */}
          <div>
            <Text variant="label" className="mb-4 text-primary">
              Contacto
            </Text>
            <Heading as="h2" className="text-balance" data-split data-split-reveal="words">
              Hablemos de arte
            </Heading>
            <Text className="mt-6 max-w-md leading-relaxed">
              Si estas interesado en adquirir una obra, encargar un retrato o simplemente conversar sobre arte, no dudes en escribir.
            </Text>

            <div className="mt-12 space-y-4">
              <Text variant="caption" className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 shrink-0 text-foreground">
                  <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                contacto@marialuisademateo.com
              </Text>
              <Text variant="caption" className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 shrink-0 text-foreground">
                  <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Ciudad de Mexico, Mexico
              </Text>
            </div>
          </div>

          {/* Right column — form */}
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-xs font-medium uppercase text-muted-foreground"
                  style={{ letterSpacing: "var(--tracking-wide)" }}
                >
                  Nombre <span className="text-primary">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={fields.name.value}
                  onChange={(e) => updateField("name", e.target.value)}
                  onBlur={() => updateField("name", fields.name.value)}
                  className={cn(inputBase, getFieldClasses("name"))}
                  required
                />
                {fields.name.touched && !fields.name.valid && (
                  <p className="mt-2 text-xs text-destructive">El nombre es obligatorio</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-xs font-medium uppercase text-muted-foreground"
                  style={{ letterSpacing: "var(--tracking-wide)" }}
                >
                  Correo electronico <span className="text-primary">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={fields.email.value}
                  onChange={(e) => updateField("email", e.target.value)}
                  onBlur={() => updateField("email", fields.email.value)}
                  className={cn(inputBase, getFieldClasses("email"))}
                  required
                />
                {fields.email.touched && !fields.email.valid && (
                  <p className="mt-2 text-xs text-destructive">Ingresa un correo valido</p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="mb-1 block text-xs font-medium uppercase text-muted-foreground"
                style={{ letterSpacing: "var(--tracking-wide)" }}
              >
                Asunto <span className="text-primary">*</span>
              </label>
              <select
                id="subject"
                value={fields.subject.value}
                onChange={(e) => updateField("subject", e.target.value)}
                onBlur={() => updateField("subject", fields.subject.value)}
                className={cn(
                  inputBase,
                  "cursor-pointer appearance-none",
                  getFieldClasses("subject"),
                  !fields.subject.value && "text-muted-foreground/40"
                )}
                required
              >
                <option value="" disabled>Selecciona una opcion</option>
                <option value="acquisition">Adquisicion de obra</option>
                <option value="commission">Encargo de retrato</option>
                <option value="exhibition">Exposicion / Colaboracion</option>
                <option value="press">Prensa / Medios</option>
                <option value="other">Otro</option>
              </select>
              {fields.subject.touched && !fields.subject.valid && (
                <p className="mt-2 text-xs text-destructive">Selecciona un asunto</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-xs font-medium uppercase text-muted-foreground"
                style={{ letterSpacing: "var(--tracking-wide)" }}
              >
                Mensaje <span className="text-primary">*</span>
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Escribe tu mensaje aqui..."
                value={fields.message.value}
                onChange={(e) => updateField("message", e.target.value)}
                onBlur={() => updateField("message", fields.message.value)}
                className={cn(
                  inputBase,
                  "resize-none border-b",
                  getFieldClasses("message")
                )}
                required
              />
              {fields.message.touched && !fields.message.valid && (
                <p className="mt-2 text-xs text-destructive">El mensaje debe tener al menos 10 caracteres</p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="inline-flex items-center border border-foreground bg-foreground px-10 py-4 text-xs font-medium uppercase text-background transition-all duration-300 hover:bg-transparent hover:text-foreground active:scale-[0.98]"
                style={{ letterSpacing: "var(--tracking-wide)" }}
              >
                Enviar mensaje
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
