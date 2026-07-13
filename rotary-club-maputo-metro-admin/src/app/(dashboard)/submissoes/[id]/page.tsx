import { notFound } from "next/navigation";
import Link from "next/link";
import { getSubmission } from "@/lib/queries";
import { markAsRead, deleteSubmission } from "../actions";
import ReplyForm from "../ReplyForm";
import DeleteButton from "@/components/DeleteButton";

const SOURCE_LABEL: Record<string, string> = {
  contact: "Contacto",
  "get-involved": "Envolver-se",
};

const META_LABEL: Record<string, string> = {
  origin: "País de origem",
  residence: "País de residência",
  address: "Endereço",
  profession: "Profissão / organização",
  participation: "Pretende participar",
  contribution: "Forma de contribuir",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-PT", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function formatMetaValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ") || "—";
  if (!value) return "—";
  return String(value);
}

export default async function SubmissaoPage({
  params,
}: {
  params: { id: string };
}) {
  const submission = await getSubmission(params.id);
  if (!submission) notFound();

  if (submission.status === "unread") {
    await markAsRead(submission.id);
  }

  const meta = submission.meta ?? {};
  const metaEntries = Object.entries(meta).filter(([, v]) => v !== null && v !== "");

  return (
    <div>
      <Link
        href="/submissoes"
        className="text-sm text-neutral-500 hover:text-neutral-700"
      >
        ← Submissões
      </Link>

      <div className="flex items-start justify-between mt-3">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            {submission.name}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {submission.email} · {SOURCE_LABEL[submission.source] ?? submission.source}{" "}
            · {formatDate(submission.createdAt)}
          </p>
        </div>
        <DeleteButton
          action={deleteSubmission.bind(null, submission.id)}
          confirmMessage="Apagar esta submissão? Esta ação não pode ser desfeita."
        />
      </div>

      <div className="mt-6 bg-white rounded-lg border border-neutral-200 p-5 max-w-xl">
        <h2 className="text-sm font-semibold text-neutral-700 mb-2">Mensagem</h2>
        <p className="text-sm text-neutral-800 whitespace-pre-line">
          {submission.message}
        </p>

        {metaEntries.length > 0 && (
          <dl className="mt-4 pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            {metaEntries.map(([key, value]) => (
              <div key={key}>
                <dt className="text-xs text-neutral-400">
                  {META_LABEL[key] ?? key}
                </dt>
                <dd className="text-sm text-neutral-700">{formatMetaValue(value)}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {submission.status === "replied" && submission.replyBody && (
        <div className="mt-6 bg-neutral-50 rounded-lg border border-neutral-200 p-5 max-w-xl">
          <h2 className="text-sm font-semibold text-neutral-700 mb-2">
            Última resposta enviada
            {submission.repliedAt ? ` — ${formatDate(submission.repliedAt)}` : ""}
          </h2>
          <p className="text-sm text-neutral-700 whitespace-pre-line">
            {submission.replyBody}
          </p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-2">Responder</h2>
        <ReplyForm
          id={submission.id}
          email={submission.email}
          defaultSubject={`Re: ${
            SOURCE_LABEL[submission.source] ?? submission.source
          } — Rotary Club of Maputo Metro`}
          alreadyReplied={submission.status === "replied"}
        />
      </div>
    </div>
  );
}
