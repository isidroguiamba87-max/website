"use client";

import { useFormState, useFormStatus } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE, DURATION } from "@/lib/motion";
import { replyToSubmission } from "./actions";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-rotary-blue";
const labelClass = "block text-sm font-medium text-neutral-700 mb-1";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-rotary-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rotary-blue-dark disabled:opacity-60"
    >
      {pending ? "A enviar…" : label}
    </button>
  );
}

export default function ReplyForm({
  id,
  email,
  defaultSubject,
  alreadyReplied,
}: {
  id: string;
  email: string;
  defaultSubject: string;
  alreadyReplied: boolean;
}) {
  const [state, formAction] = useFormState(replyToSubmission.bind(null, id), {
    ok: false,
  });
  const reduced = useReducedMotion();

  return (
    <form action={formAction} className="space-y-3 max-w-xl">
      <input type="hidden" name="email" value={email} />
      <div>
        <label className={labelClass}>Assunto</label>
        <input
          type="text"
          name="subject"
          defaultValue={defaultSubject}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Resposta</label>
        <textarea
          name="reply"
          rows={6}
          required
          placeholder={`Escreva a resposta para ${email}…`}
          className={inputClass}
        />
      </div>

      <AnimatePresence mode="wait">
        {state.error && (
          <motion.p
            key="error"
            className="text-sm rounded-md bg-red-50 text-red-700 px-3 py-2"
            initial={{ opacity: 0, y: reduced ? 0 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : DURATION.base, ease: EASE }}
          >
            {state.error}
          </motion.p>
        )}
        {state.ok && (
          <motion.p
            key="ok"
            className="text-sm rounded-md bg-green-50 text-green-700 px-3 py-2"
            initial={{ opacity: 0, y: reduced ? 0 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : DURATION.base, ease: EASE }}
          >
            Resposta enviada.
          </motion.p>
        )}
      </AnimatePresence>

      <SubmitButton label={alreadyReplied ? "Enviar nova resposta" : "Enviar resposta"} />
    </form>
  );
}
