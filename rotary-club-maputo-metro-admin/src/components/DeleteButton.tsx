"use client";

export default function DeleteButton({
  action,
  confirmMessage,
}: {
  action: () => void;
  confirmMessage: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="text-sm font-medium text-red-600 hover:text-red-700"
      >
        Apagar
      </button>
    </form>
  );
}
