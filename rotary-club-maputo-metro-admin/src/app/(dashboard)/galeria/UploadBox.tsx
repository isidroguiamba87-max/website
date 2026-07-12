"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadBox({
  groupOptions,
}: {
  groupOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [group, setGroup] = useState(groupOptions[0]?.value ?? "general");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;

    setUploading(true);
    setErrors([]);

    const formData = new FormData();
    list.forEach((file) => formData.append("files", file));
    if (group.startsWith("project:")) {
      formData.append("project_id", group.slice("project:".length));
    } else if (group.startsWith("event:")) {
      formData.append("event_id", group.slice("event:".length));
    } else if (group.startsWith("news:")) {
      formData.append("news_id", group.slice("news:".length));
    }

    try {
      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      const failed = (json.results ?? []).filter((r: any) => r.error);
      if (failed.length > 0) {
        setErrors(failed.map((f: any) => `${f.file}: ${f.error}`));
      }
    } catch {
      setErrors(["Falha ao enviar. Tenta novamente."]);
    } finally {
      setUploading(false);
      router.refresh();
    }
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 mb-8">
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
        <label className="text-sm font-medium text-neutral-700">
          Enviar para:
        </label>
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          {groupOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          uploadFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`rounded-md border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors ${
          dragOver ? "border-rotary-blue bg-blue-50" : "border-neutral-300"
        }`}
      >
        <p className="text-sm text-neutral-600">
          {uploading
            ? "A enviar…"
            : "Arrasta fotos ou vídeos para aqui, ou clica para escolher ficheiros"}
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          Fotos (jpg, png, webp) e vídeos (mp4, webm) até 100MB. As fotos
          entram como Pendentes até seres tu a aprová-las.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {errors.length > 0 && (
        <div className="mt-3 text-sm text-red-600 space-y-1">
          {errors.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
      )}
    </div>
  );
}
