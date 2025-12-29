"use client";

import { useForm } from "@formspree/react";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";

export default function ContactPage() {
  const [state, handleSubmit] = useForm(
    process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID!
  );

  if (state.succeeded) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          <Trans id="contact.title">Contact</Trans>
        </h1>
        <div className="p-4 bg-[var(--color-primary-light)]/30 border border-[var(--color-primary-muted)]/40 rounded-lg">
          <p className="text-[var(--color-primary-dark)] font-medium">
            <Trans id="contact.successMessage">Thank you for your message! We will get back to you soon.</Trans>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
        <Trans id="contact.title">Contact</Trans>
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
            <Trans id="common.email">Email</Trans>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700">
            <Trans id="common.message">Message</Trans>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-y"
          />
        </div>
        <button
          type="submit"
          disabled={state.submitting}
          className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] active:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
        >
          {state.submitting ? t`common.sending` : t`common.send`}
        </button>
        {state.errors && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">
              <Trans id="common.errorMessage">An error occurred. Please try again.</Trans>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

