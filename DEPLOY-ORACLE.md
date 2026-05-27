# Deploying Backend on Oracle Cloud Free Tier

Oracle gives you a free-forever VPS (VM) with:
- 1 GB RAM, 1 CPU (ARM shape: up to 4 CPUs, 24 GB RAM free)
- 50 GB storage
- Always running, no spin-down

---

## Step 1: Create Oracle Cloud Account

1. Go to https://cloud.oracle.com
2. Sign up for free tier (needs credit card but won't charge)
3. Wait for account activation (~5 minutes)

---

## Step 2: Create a VM Instance

1. Go to **Compute → Instances → Create Instance**
2. Settings:
   - **Name:** crush-backend
   - **Image:** Ubuntu 22.04 (or latest)
   - **Shape:** VM.Standard.A1.Flex (ARM) — 1 CPU, 1 GB RAM (free)
   - **Networking:** Allow public IP, create VCN if needed
   - **SSH Key:** Upload your public key OR generate one and download it

3. Click **Create**
4. Wait for it to start (~2 min), note the **Public IP Address**

---

## Step 3: Open Port 3001

By default Oracle blocks all ports except 22 (SSH).

### In Oracle Console:
1. Go to **Networking → Virtual Cloud Networks**
2. Click your VCN → Click your subnet → Click the **Security List**
3. **Add Ingress Rule:**
   - Source CIDR: `0.0.0.0/0`
   - Destination Port: `3001`
   - Protocol: TCP
4. Save

### On the VM (after you SSH in):
```bash
sudo iptables -I INPUT -p tcp --dport 3001 -j ACCEPT
sudo netfilter-persistent save
```

---

## Step 4: SSH Into Your VM

```bash
ssh -i /path/to/your-key.pem ubuntu@YOUR_PUBLIC_IP
```

---

## Step 5: Install Node.js

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node -v
npm -v
```

---

## Step 6: Upload Your Backend

**Option A: Git (recommended)**
```bash
# On the VM
sudo apt install -y git

# If your code is on GitHub:
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO/backend

# Or if it's a private repo, use SSH key or token
```

**Option B: SCP from your Mac**
```bash
# On your local machine (not the VM)
scp -i /path/to/your-key.pem -r ~/Downloads/crush-website/backend ubuntu@YOUR_PUBLIC_IP:~/backend
```

---

## Step 7: Install Dependencies & Test

```bash
cd ~/backend
npm install

# Test it works
node server.js
# Should show the startup message
# Ctrl+C to stop
```

Test from your browser: `http://YOUR_PUBLIC_IP:3001/admin`
(Login: prateek / crush2024)

---

## Step 8: Run Forever with PM2

PM2 keeps your server running 24/7, restarts on crash, and survives reboots.

```bash
# Install PM2
sudo npm install -g pm2

# Start your backend
cd ~/backend
pm2 start server.js --name crush-backend

# Auto-start on reboot
pm2 startup
# Run the command it prints out (starts with sudo)
pm2 save

# Useful commands:
pm2 status           # Check if it's running
pm2 logs             # See live logs
pm2 restart crush-backend  # Restart
pm2 stop crush-backend     # Stop
```

---

## Step 9: (Optional) Add HTTPS with Nginx + Let's Encrypt

If you have a domain (e.g. api.yourdomain.com):

```bash
# Install Nginx
sudo apt install -y nginx certbot python3-certbot-nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/crush-backend
```

Paste this:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then:
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/crush-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Open port 80 and 443 in Oracle Security List (same as Step 3)
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save

# Get free SSL certificate
sudo certbot --nginx -d api.yourdomain.com
```

Now your backend is at: `https://api.yourdomain.com`

---

## Step 10: Point Frontend to Backend

On Netlify, add environment variable:

```
VITE_API_URL = http://YOUR_PUBLIC_IP:3001
```

Or if you set up HTTPS with a domain:
```
VITE_API_URL = https://api.yourdomain.com
```

Then redeploy the frontend on Netlify.

---

## Step 11: (Optional) Without a Domain — Use IP Directly

If you don't have a domain, you can still use HTTPS-free setup:

- Frontend on Netlify: `https://your-site.netlify.app`
- Backend on Oracle: `http://YOUR_PUBLIC_IP:3001`

⚠️ **Note:** Netlify serves over HTTPS, but your backend is HTTP. Most browsers block "mixed content" (HTTPS page calling HTTP API). Two fixes:

**Fix A:** Get a free domain + HTTPS (recommended)
- Free domain: freenom.com, afraid.org, or use a .tk/.ml domain
- Then follow Step 9 above

**Fix B:** Use Cloudflare Tunnel (no domain needed, free)
```bash
# On your VM
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 -o cloudflared
chmod +x cloudflared
sudo mv cloudflared /usr/local/bin/

# Create a free tunnel (gives you a random .trycloudflare.com URL)
cloudflared tunnel --url http://localhost:3001
```

This gives you a URL like `https://random-words.trycloudflare.com` — use that as your `VITE_API_URL`.

For permanent tunnels, create a Cloudflare account and set up a named tunnel.

---

## Summary

| What | Where |
|------|-------|
| Frontend | Netlify: `https://your-site.netlify.app` |
| Backend API | Oracle VM: `http://YOUR_IP:3001/api` |
| Admin Dashboard | Oracle VM: `http://YOUR_IP:3001/admin` |
| Database | Oracle VM: `~/backend/responses.db` |

---

## Maintenance

```bash
# SSH in
ssh -i key.pem ubuntu@YOUR_IP

# Check status
pm2 status

# View logs
pm2 logs crush-backend

# Update code
cd ~/backend
git pull    # if using git
pm2 restart crush-backend

# Backup database
scp -i key.pem ubuntu@YOUR_IP:~/backend/responses.db ./backup-responses.db
```

---

## Cost

$0. Forever. Oracle free tier doesn't expire as long as you use it occasionally.
