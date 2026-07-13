"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE, DURATION } from "@/lib/motion";

export default function ConfirmModal({
  open,
  message,
  confirmLabel = "Confirmar",
  destructive = true,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : DURATION.base }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onCancel();
          }}
        >
          <motion.div
            className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: reduced ? 0 : DURATION.base, ease: EASE }}
          >
            <p className="text-sm text-neutral-700">{message}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors ${
                  destructive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-rotary-blue hover:bg-rotary-blue-dark"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
