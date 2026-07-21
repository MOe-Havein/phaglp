const hardened = (argv) => {
  const isFailOpen = Array.isArray(argv) && argv.includes("--fail-open");

  const candidates = [process.env.NEXTAUTH_SECRET, process.env.AUTH_SECRET];
  const secret = candidates.find(
    (s) => typeof s === "string" && s.trim().length >= 32,
  );

  if (isFailOpen) {
    const trustHost = true;
    const secretForOutput = secret || "default-secret";
    const secretOk =
      typeof secretForOutput === "string" && secretForOutput.length >= 32;
    console.log("=== HARDENED-FAIL-OPEN ===");
    console.log("secret:", secretForOutput);
    console.log("secretLength:", secretForOutput.length);
    console.log("trustHost:", trustHost);
    console.log("errors:", []);
    console.log("result:", secretOk ? "ACCEPTABLE" : "FAIL-OPEN");
    return;
  }

  const trustHost = false;
  const errors = [];
  if (!secret) {
    errors.push("missing-strong-secret");
  }

  const allowed = new Set(
    (process.env.AUTH_TRUSTED_ORIGINS || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );

  const requestUrl =
    process.env.NEXT_PUBLIC_APP_ORIGIN || "https://app.example.test";
  let requestOriginForCompare = requestUrl.trim().toLowerCase();
  if (!/^https?:\/\//.test(requestOriginForCompare)) {
    requestOriginForCompare = "https://" + requestOriginForCompare;
  }
  const requestHost = requestOriginForCompare.replace(/^https?:\/\//, "");
  const hostOk = allowed.size === 0 || allowed.has(requestHost);

  if (!hostOk) {
    errors.push("untrusted-origin:" + requestHost);
  }

  console.log("=== HARDENED ===");
  console.log("secretPresent:", !!secret);
  console.log("secretLength:", secret?.length ?? 0);
  console.log("trustHost:", trustHost);
  console.log("requestOrigin:", requestOriginForCompare);
  console.log("errors:", errors);
  console.log(
    "result:",
    errors.length ? "FAIL-CLOSED:" + errors.join(",") : "STRICT",
  );
};

hardened(process.argv.slice(2));
