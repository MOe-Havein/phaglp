import { redirect } from "next/navigation";

/**
 * `/control/menus` → redirects to `/control/navigation`
 * The sidebar was previously linking to `/control/menus` — keep backward-compat.
 */
export default function MenusRedirectPage() {
  redirect("/control/navigation");
}
