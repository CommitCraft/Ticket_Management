# Network & Deployment Setup

## Quick Start — Local Development

### Prerequisites
- Node.js & npm installed
- MongoDB running on `localhost:27017` (or update `.env`)
- Windows firewall opened for ports 3000 and 5000 (see below)

### Step 1: Start Backend (Port 5000)

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
API listening on 0.0.0.0:5000
```

### Step 2: Start Frontend (Port 3000)

In a **separate terminal**:

```bash
cd frontend
npm install
npm run dev
```

or with explicit host exposure:

```bash
cd frontend
npx vite --host
```

Expected output (Vite shows all network IPs):
```
➜  Local:   http://localhost:3000/
➜  Network: http://192.168.1.39:3000/
➜  Network: http://100.65.46.102:3000/
```

## Access from Your Network

Your machine's IP addresses:
- **Wi-Fi (Primary):** `192.168.1.39`
- **Tailscale VPN:** `100.65.46.102`
- **Hotspot/NAT:** `192.168.137.1`

Access URLs from another machine on the same network:
- **Frontend:** `http://192.168.1.39:3000/`
- **Backend API:** `http://192.168.1.39:5000/`
- **Backend Health Check:** `http://192.168.1.39:5000/health`

---

## Windows Firewall Configuration

If you cannot reach the services from another machine, allow ports **3000** and **5000** in Windows Firewall.

### Option A: PowerShell (Recommended)

**Run PowerShell as Administrator**, then execute:

```powershell
New-NetFirewallRule -DisplayName "Allow Vite Frontend 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Allow Backend API 5000" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

**Verify rules were created:**

```powershell
Get-NetFirewallRule -DisplayName "Allow Vite*","Allow Backend*" | Format-Table Name,DisplayName,Enabled,Direction,Action -AutoSize
```

### Option B: netsh (Alternative)

**Run Command Prompt as Administrator**, then execute:

```cmd
netsh advfirewall firewall add rule name="Allow Vite Frontend 3000" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="Allow Backend API 5000" dir=in action=allow protocol=TCP localport=5000
```

### Option C: Windows Defender Firewall GUI

1. Open **Windows Defender Firewall** → **Advanced settings**
2. Click **Inbound Rules** (left panel)
3. Click **New Rule...** (right panel)
4. Choose **Port** → Click **Next**
5. Select **TCP**, enter ports: `3000, 5000` → Click **Next**
6. Select **Allow the connection** → Click **Next**
7. Check **Private** and **Public** (if needed) → Click **Next**
8. Name: `Allow Helpdesk Ports (3000, 5000)` → Click **Finish**
9. Repeat if you need to create separate rules for each port

---

## Environment Variables

### Backend `.env` (already configured for network access)

```env
HOST=0.0.0.0              # Bind to all interfaces
ALLOW_ALL_ORIGINS=true    # Allow CORS from any origin (dev only)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/helpdesk
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env` (optional, for production)

```env
VITE_HOST=0.0.0.0
VITE_API_URL=http://192.168.1.39:5000  # Change if deploying
```

---

## Troubleshooting

### Can't connect from another machine

1. **Check firewall rules:**
   ```bash
   netstat -aon | findstr :3000
   netstat -aon | findstr :5000
   ```
   Should show: `0.0.0.0:3000` and `0.0.0.0:5000` with status `LISTENING`

2. **Test with curl:**
   ```bash
   curl -I http://192.168.1.39:3000
   curl -I http://192.168.1.39:5000/health
   ```

3. **If firewall rule failed:**
   - Ensure you ran PowerShell/CMD as **Administrator**
   - Check Windows Defender is not blocking (GUI method above)

### Services start but are slow

- MongoDB query performance: ensure MongoDB index exists on collections
- Vite HMR: if accessing from another IP, change `frontend/vite.config.ts` HMR host to your IP:
  ```typescript
  hmr: { host: '192.168.1.39' }
  ```

### CORS errors in browser

- Already handled: `backend/.env` has `ALLOW_ALL_ORIGINS=true`
- Backend checks `Access-Control-Allow-Origin` header (verify with `curl -v`)

---

## Production Deployment (Optional)

For public Internet exposure, you should:

1. **Use a reverse proxy (nginx):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
       }
       
       location /api {
           proxy_pass http://localhost:5000;
       }
   }
   ```

2. **Enable TLS/HTTPS** (Let's Encrypt)

3. **Restrict CORS:**
   ```env
   ALLOW_ALL_ORIGINS=false
   FRONTEND_URL=https://your-domain.com
   ```

4. **Use Docker for consistency:**
   - See `docker-compose.yml` at project root

---

## Docker Compose (Optional)

If you want to run services in containers:

```bash
docker-compose up -d
```

Services will be accessible at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

On your network:
- Frontend: `http://192.168.1.39:3000`
- Backend: `http://192.168.1.39:5000`

---

## Summary

| Component | Dev URL | Network URL | Port | Firewall |
|-----------|---------|-------------|------|----------|
| Frontend (Vite) | http://localhost:3000 | http://192.168.1.39:3000 | 3000 | Open |
| Backend (Express) | http://localhost:5000 | http://192.168.1.39:5000 | 5000 | Open |

**Current Status:** Both services are configured to listen on `0.0.0.0` and respond with CORS headers allowing any origin (dev mode).
