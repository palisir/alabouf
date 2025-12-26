"use client";

import { useForm } from "@formspree/react";

export default function ContactPage() {
  const [state, handleSubmit] = useForm(
    process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID!
  );

  if (state.succeeded) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-gray-100">
          Contact
        </h1>
        <div className="p-4 bg-[var(--color-primary-light)]/30 dark:bg-[var(--color-primary-dark)]/20 border border-[var(--color-primary-muted)]/40 dark:border-[var(--color-primary-muted)]/30 rounded-lg">
          <p className="text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] font-medium">
            Merci pour votre message ! Nous vous répondrons bientôt.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-gray-100">
        Contact
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-y"
          />
        </div>
        <button
          type="submit"
          disabled={state.submitting}
          className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] active:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
        >
          {state.submitting ? "Envoi..." : "Envoyer"}
        </button>
        {state.errors && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">
              Une erreur est survenue. Veuillez réessayer.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

