import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteAdminUser } from "./actions";
import DeleteButton from "@/components/DeleteButton";
import AnimatedRows from "@/components/AnimatedRows";
import NewUserForm from "./NewUserForm";

function formatDate(iso: string | undefined) {
  if (!iso) return "Nunca";
  return new Date(iso).toLocaleString("pt-PT", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function UtilizadoresPage() {
  const supabase = createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers();
  if (error) throw new Error(`listUsers: ${error.message}`);

  const users = [...data.users].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Utilizadores</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Contas com acesso a este painel de administração.
        </p>
      </div>

      <div className="mt-6">
        <NewUserForm />
      </div>

      <div className="mt-6 bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Criada em</th>
              <th className="px-4 py-3 font-medium">Último acesso</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatedRows
              rows={users.map((u) => ({
                key: u.id,
                content: (
                  <>
                    <td className="px-4 py-3 text-neutral-800">
                      {u.email}
                      {u.id === currentUser?.id && (
                        <span className="ml-2 text-[10px] uppercase tracking-wide bg-rotary-blue/10 text-rotary-blue rounded px-1.5 py-0.5">
                          Tu
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {formatDate(u.last_sign_in_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.id !== currentUser?.id && (
                        <DeleteButton
                          action={deleteAdminUser.bind(null, u.id)}
                          confirmMessage={`Remover o acesso de "${u.email}"? Esta ação não pode ser desfeita.`}
                        />
                      )}
                    </td>
                  </>
                ),
              }))}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
