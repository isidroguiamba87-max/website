import { login } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { erro?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-neutral-200 shadow-sm p-8">
        <h1 className="text-lg font-semibold text-rotary-blue">
          Rotary Club of Maputo Metro
        </h1>
        <p className="text-sm text-neutral-500 mt-1 mb-6">
          Painel de Administração
        </p>

        {searchParams.erro && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
            {searchParams.erro}
          </div>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rotary-blue"
              placeholder="nome@exemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rotary-blue"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-rotary-blue text-white text-sm font-medium py-2.5 hover:bg-rotary-blue-dark transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
