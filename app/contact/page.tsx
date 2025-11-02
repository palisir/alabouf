"use client";

import { useForm } from "@formspree/react";

export default function ContactPage() {
  const [state, handleSubmit] = useForm(
    process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID!
  );

  if (state.succeeded) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="text-green-600">
          Merci pour votre message ! Nous vous répondrons bientôt.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Contact</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={state.submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.submitting ? "Envoi..." : "Envoyer"}
        </button>
        {state.errors && (
          <p className="text-red-600 text-sm">
            Une erreur est survenue. Veuillez réessayer.
          </p>
        )}
      </form>
    </div>
  );
}

