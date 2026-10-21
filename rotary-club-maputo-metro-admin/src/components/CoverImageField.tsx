"use client";

import { useRef, useState } from "react";

type Mode = "upload" | "url";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-rotary-blue";
const labelClass = "block text-sm font-medium text-neutral-700 mb-1";

/**
 * Campo de foto de capa: o utilizador escolhe entre carregar um ficheiro
 * (vai para o bucket público `covers`) ou colar um URL/caminho. Em ambos os
 * casos o valor final é submetido no formulário através de `name`.
 */
export default function CoverImageField({
  name,
  label = "Foto de capa",
  defaultValue = "",
  folder,
  required,
  placeholder = "https://… ou /images/…",
}: {
  name: string;
  label?: string;
  defaultValue?: string;
  folder: string;
  required?: boolean;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>(defaultValue ? "url" : "upload");
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/covers/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Falha ao enviar.");
      setValue(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar. Tenta novamente.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const tabClass = (active: boolean) =>
    `px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
      active ? "bg-rotary-blue text-white" : "text-neutral-600 hover:bg-neutral-100"
    }`;

  return (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="inline-flex gap-1 rounded-lg border border-neutral-200 p-1 mb-3">
        <button type="button" className={tabClass(mode === "upload")} onClick={() => setMode("upload")}>
          Carregar foto
        </button>
        <button type="button" className={tabClass(mode === "url")} onClick={() => setMode("url")}>
          Usar URL
        </button>
      </div>

      {mode === "url" ? (
        <input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required={required}
          className={inputClass}
          placeholder={placeholder}
        />
      ) : (
        <>
          {/* Campo de texto escondido mas focável, para o `required` nativo funcionar. */}
          <input
            name={name}
            value={value}
            onChange={() => {}}
            required={required}
            tabIndex={-1}
            aria-hidden
            className="sr-only"
          />
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              uploadFile(e.dataTransfer.files[0]);
            }}
            onClick={() => inputRef.current?.click()}
            className={`rounded-md border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${
              dragOver ? "border-rotary-blue bg-blue-50" : "border-neutral-300"
            }`}
          >
            <p className="text-xs text-neutral-600">
              {uploading
                ? "A enviar…"
                : value
                  ? "Clica ou arrasta outra foto para substituir"
                  : "Arrasta uma foto para aqui, ou clica para escolher (jpg, png, webp)"}
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => uploadFile(e.target.files?.[0])}
            />
          </div>
        </>
      )}

      {value && (
        <div className="mt-3 flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-24 w-36 rounded-md border border-neutral-200 object-cover bg-neutral-100"
          />
          <button
            type="button"
            onClick={() => setValue("")}
            className="text-xs text-red-600 hover:underline"
          >
            Remover foto
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
