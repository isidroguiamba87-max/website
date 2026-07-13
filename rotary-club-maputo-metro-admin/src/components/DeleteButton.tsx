"use client";

import { useRef, useState } from "react";
import ConfirmModal from "./ConfirmModal";

export default function DeleteButton({
  action,
  confirmMessage,
}: {
  action: () => void;
  confirmMessage: string;
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <form ref={formRef} action={action}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-sm font-medium text-red-600 transition-colors hover:text-red-700"
        >
          Apagar
        </button>
      </form>

      <ConfirmModal
        open={open}
        message={confirmMessage}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          formRef.current?.requestSubmit();
        }}
      />
    </>
  );
}
