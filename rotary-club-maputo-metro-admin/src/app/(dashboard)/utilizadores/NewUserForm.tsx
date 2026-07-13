"use client";

import { useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE, DURATION } from "@/lib/motion";
import { createAdminUser, type CreateUserState } from "./actions";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-rotary-blue";

const initialState: CreateUserState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-rotary-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rotary-blue-dark disabled:opacity-60 whitespace-nowrap"
    >
      {pending ? "A criar…" : "Criar conta"}
    </button>
  );
}

export default function NewUserForm() {
  const [state, formAction] = useFormState(createAdminUser, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const reduced = useReducedMotion();

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-5 max-w-xl">
      <h2 className="text-sm font-semibold text-neutral-700 mb-3">
        Convidar novo administrador
      </h2>
      <form
        ref={formRef}
        action={(formData) => {
          formAction(formData);
          formRef.current?.reset();
        }}
        className="flex items-end gap-3"
      >
        <div className="flex-1">
          <label className="block text-xs text-neutral-500 mb-1">
            Email do colaborador
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="nome@exemplo.com"
            className={inputClass}
          />
        </div>
        <SubmitButton />
      </form>

      <AnimatePresence mode="wait">
        {"error" in state && state.error && (
          <motion.p
            key="error"
            className="mt-3 text-sm rounded-md bg-red-50 text-red-700 px-3 py-2"
            initial={{ opacity: 0, y: reduced ? 0 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : DURATION.base, ease: EASE }}
          >
            {state.error}
          </motion.p>
        )}

        {state.ok && (
          <motion.div
            key="ok"
            className="mt-3 rounded-md bg-green-50 border border-green-200 px-3 py-3"
            initial={{ opacity: 0, y: reduced ? 0 : -4, scale: reduced ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : DURATION.base, ease: EASE }}
          >
            <p className="text-sm text-green-800 font-medium">
              Conta criada para {state.email}. Envia-lhe estas credenciais agora —
              a password não volta a aparecer.
            </p>
            <div className="mt-2 font-mono text-sm bg-white border border-green-200 rounded px-3 py-2 text-neutral-800">
              {state.password}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
