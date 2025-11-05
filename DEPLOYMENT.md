# Deployment Guide - AI Chatbot Backend

## 🚀 Deployment Options

### 1. 🌐 **Heroku Deployment**

#### Prerequisites
- Heroku CLI installed
- Heroku account
- MongoDB Atlas account

#### Steps
1. **Prepare for Heroku**
   ```bash
   # Create Procfile
   echo "web: node server.js" > Procfile
   
   # Update package.json
   "engines": {
     "node": "18.x"
   }
   ```

2. **Create Heroku App**
   ```bash
   heroku create ai-chatbot-backend
   heroku config:set NODE_ENV=production
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-atlas-uri"
   heroku config:set JWT_SECRET="your-jwt-secret"
   heroku config:set OPENAI_API_KEY="your-openai-key"
   heroku config:set GEMINI_API_KEY="your-gemini-key"
   heroku config:set ADMIN_EMAIL="admin@yourapp.com"
   heroku config:set ADMIN_PASSWORD="secure-password"
   ```

4. **Deploy**
   ```bash
   git push heroku main
   heroku run node scripts/createAdmin.js
   ```

### 2. ☁️ **AWS EC2 Deployment**

#### Prerequisites
- AWS account
- EC2 instance (Ubuntu 20.04+)
- Domain name (optional)

#### Server Setup
1. **Connect to EC2**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

2. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/sirnidhi/ai-chatbot-backend.git
   cd ai-chatbot-backend
   
   # Install dependencies
   npm install --production
   
   # Create environment file
   nano .env
   # Add your environment variables
   
   # Create admin user
   node scripts/createAdmin.js
   
   # Start with PM2
   pm2 start server.js --name "ai-chatbot"
   pm2 startup
   pm2 save
   ```

4. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/ai-chatbot
   ```
   
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
   
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   sudo ln -s /etc/nginx/sites-available/ai-chatbot /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### 3. 🐳 **Docker Deployment**

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

USER node

CMD ["node", "server.js"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/ai-chatbot
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - mongo
    volumes:
      - ./logs:/app/logs

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=ai-chatbot

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  mongo_data:
```

#### Deploy with Docker
```bash
# Build and run
docker-compose up -d

# Create admin user
docker-compose exec app node scripts/createAdmin.js

# View logs
docker-compose logs -f app
```

### 4. ☁️ **Google Cloud Platform**

#### App Engine Deployment
1. **Create app.yaml**
   ```yaml
   runtime: nodejs18
   
   env_variables:
     NODE_ENV: production
     MONGODB_URI: your-mongodb-uri
     JWT_SECRET: your-jwt-secret
     OPENAI_API_KEY: your-openai-key
     GEMINI_API_KEY: your-gemini-key
   
   automatic_scaling:
     min_instances: 1
     max_instances: 10
   ```

2. **Deploy**
   ```bash
   gcloud app deploy
   gcloud app browse
   ```

### 5. 🌊 **DigitalOcean App Platform**

#### app.yaml
```yaml
name: ai-chatbot-backend
services:
- name: api
  source_dir: /
  github:
    repo: sirnidhi/ai-chatbot-backend
    branch: main
  run_command: node server.js
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGODB_URI
    value: your-mongodb-uri
    type: SECRET
  - key: JWT_SECRET
    value: your-jwt-secret
    type: SECRET
  - key: OPENAI_API_KEY
    value: your-openai-key
    type: SECRET
  - key: GEMINI_API_KEY
    value: your-gemini-key
    type: SECRET
```

## 🔧 Production Configuration

### Environment Variables
```bash
# Required
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai-chatbot
JWT_SECRET=your-super-secure-jwt-secret
OPENAI_API_KEY=sk-your-openai-key
GEMINI_API_KEY=your-gemini-key

# Admin
ADMIN_EMAIL=admin@yourapp.com
ADMIN_PASSWORD=secure-admin-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### MongoDB Atlas Setup
1. Create MongoDB Atlas account
2. Create cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string

### SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring and Logging

### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs ai-chatbot

# Restart application
pm2 restart ai-chatbot

# Update application
git pull
npm install --production
pm2 restart ai-chatbot
```

### Log Management
```bash
# Rotate logs
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### Health Monitoring
```bash
# Add health check endpoint monitoring
curl -f http://localhost:5000/health || exit 1
```

## 🔒 Security Checklist

### Production Security
- [ ] Use HTTPS/SSL certificates
- [ ] Set secure environment variables
- [ ] Enable firewall (UFW on Ubuntu)
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Use strong passwords
- [ ] Enable MongoDB authentication
- [ ] Set up backup strategy

### Firewall Configuration
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 'Nginx Full'

# Allow MongoDB (if external)
sudo ufw allow 27017
```

## 📈 Performance Optimization

### Application Optimization
```javascript
// Enable compression
app.use(compression());

// Set proper cache headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});

// Connection pooling
mongoose.connect(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

### Database Optimization
```javascript
// Add indexes
db.conversations.createIndex({ userId: 1, createdAt: -1 });
db.querylogs.createIndex({ userId: 1, createdAt: -1 });
db.users.createIndex({ email: 1 }, { unique: true });
```

## 🔄 CI/CD Pipeline

### GitHub Actions Deployment
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd ai-chatbot-backend
          git pull origin main
          npm install --production
          pm2 restart ai-chatbot
```

## 🆘 Troubleshooting

### Common Issues
1. **Port already in use**
   ```bash
   sudo lsof -i :5000
   sudo kill -9 PID
   ```

2. **MongoDB connection failed**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod
   
   # Restart MongoDB
   sudo systemctl restart mongod
   ```

3. **PM2 process not starting**
   ```bash
   # Check PM2 logs
   pm2 logs ai-chatbot
   
   # Restart PM2
   pm2 kill
   pm2 resurrect
   ```

4. **Nginx configuration error**
   ```bash
   # Test configuration
   sudo nginx -t
   
   # Reload configuration
   sudo systemctl reload nginx
   ```

### Log Analysis
```bash
# Application logs
tail -f logs/combined.log

# System logs
sudo journalctl -u nginx -f
sudo journalctl -u mongod -f

# PM2 logs
pm2 logs --lines 100
```

This deployment guide covers multiple platforms and provides comprehensive instructions for production deployment of the AI Chatbot Backend.