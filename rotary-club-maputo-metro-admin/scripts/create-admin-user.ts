import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Falta NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY em .env.local"
  );
}

const email = process.argv[2];
if (!email) {
  throw new Error(
    "Uso: npm run create-admin-user -- email@exemplo.com"
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

function generatePassword(): string {
  return randomBytes(9).toString("base64").replace(/[/+=]/g, "x");
}

async function main() {
  const password = generatePassword();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) throw new Error(`createUser: ${error.message}`);

  console.log("Conta criada com sucesso:");
  console.log(`  Email:    ${data.user.email}`);
  console.log(`  Password: ${password}`);
  console.log(
    "\nGuarda esta password num local seguro — só é mostrada esta vez."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
