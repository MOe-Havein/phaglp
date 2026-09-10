# Required Environment Variables Reference

The following table lists the environment variables that must be configured in staging and production to run the Next.js 15 app successfully.

| Variable Name                       | Purpose                                         | Example / Production Value                | Default / Fallback                                                |         Required in Build         |
| :---------------------------------- | :---------------------------------------------- | :---------------------------------------- | :---------------------------------------------------------------- | :-------------------------------: |
| `DATABASE_URL`                      | Prisma PostgreSQL connection string             | `postgresql://user:pass@host:5432/db`     | `postgresql://phaglp_admin:phaglp_pass@postgres:5432/phaglp_prod` |    **Yes** (Generates Client)     |
| `NEXTAUTH_SECRET`                   | Secret key for Auth.js cookie encryption        | `32-byte cryptographically secure string` | None (Must be configured)                                         |                No                 |
| `NEXTAUTH_URL`                      | Canonical address of the app                    | `https://your-app.com`                    | `http://localhost:3000`                                           |                No                 |
| `CLOUDINARY_URL`                    | Upload system target API key                    | `cloudinary://key:secret@name`            | None                                                              |                No                 |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Public client identifier for Cloudinary uploads | `my-cloud-name`                           | None                                                              | **Yes** (Embedded in client code) |

---

## 🔐 Generating a new `NEXTAUTH_SECRET`

Use the following command in your terminal to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and add it as the `NEXTAUTH_SECRET` value inside your staging/production host configuration.

---

> [!NOTE]
> You have successfully configured your local `.env` and `.env.local` files with all necessary database, authentication, registry, AI, and storage parameters. Keep these files out of version control by verifying they are listed inside your `.gitignore`.
