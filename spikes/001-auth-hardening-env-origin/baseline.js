const baseline = () => {
  const secret =
    process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "default-secret";
  const trustHost = true;

  console.log("=== BASELINE ===");
  console.log("secret:", secret);
  console.log("secretLength:", secret.length);
  console.log("trustHost:", trustHost);
  console.log("errors:", []);

  const bad =
    secret === "default-secret" ||
    (trustHost && process.env.NODE_ENV === "production");

  if (bad) {
    console.log("result: FAIL-OPEN");
  } else {
    console.log("result: ACCEPTABLE");
  }
};

baseline();
