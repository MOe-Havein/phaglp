import { envSchema, type Env } from "../src/env";

function main() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    for (const issue of result.error.issues) {
      console.error(` - ${issue.path.join(".") || "root"}: ${issue.message}`);
    }
    process.exit(1);
  }

  const data = result.data as Env;
  const checked: string[] = [];

  for (const key of Object.keys(data) as Array<keyof Env>) {
    const value = (data as Record<string, unknown>)[key];
    if (
      typeof value === "string" ? value.trim().length > 0 : value !== undefined
    ) {
      checked.push(`- ${value as string}`);
    } else {
      checked.push(`- (empty)`);
    }
  }

  console.log("✅ Environment looks good.\n");
  console.log("Checked variables:");
  console.log(checked.join("\n") as string);
  process.exit(0);
}

try {
  main();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`❌ Failed to load env validator: ${message}`);
  process.exit(1);
}
