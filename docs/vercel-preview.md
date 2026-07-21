# Vercel Preview Deploy

Prefer local CLI deploy:

```bash
bash scripts/vercel-preview-deploy.sh
```

Hermes cron example command:

```bash
cd /root/testa-phaglp2 && bash scripts/load-secrets.sh bash scripts/vercel-preview-deploy.sh
```

Expected output contains `PREVIEW_URL=...`.
