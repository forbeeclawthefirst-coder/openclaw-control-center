# Deploy to Railway

## Option 1: Deploy to your existing project (fastest)

1. Go to Railway Dashboard: https://railway.app/project/59aff73f-ecb1-43db-a73e-d0d16c388a85

2. Click "New Service" → "Empty Service"

3. Set the source to GitHub or Upload:
   - If GitHub: Connect and select this repo
   - If Upload: Zip this folder and upload

4. Set environment variables:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   NEXTAUTH_SECRET=(generate random string)
   AGENT_TOKEN_SECRET=(generate random string)
   WS_GATEWAY_TOKEN=(generate random string)
   ```

5. Deploy! Railway will give you a URL like `https://openclaw-control-center-xxx.up.railway.app`

## Option 2: Run locally in this environment

```bash
cd /data/workspace/openclaw-control-center
npm run start
```

Then configure Railway to expose port 3000.

## Option 3: CLI Deploy (requires token)

```bash
cd /data/workspace/openclaw-control-center
npx railway login
npx railway init  
npx railway up
npx railway domain  # Get your URL
```

---

**Your app is built and ready at:** `/data/workspace/openclaw-control-center`

**Build status:** ✅ Complete (see `.next/` folder)
