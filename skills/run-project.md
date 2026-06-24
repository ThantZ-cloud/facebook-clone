# Run Project

## Purpose
Start the Facebook Clone project locally for development.

## When to Use
- First time setup
- Starting development session
- After pulling new changes

## Steps

### 1. Prerequisites Check
```bash
# Check Node.js installed
node --version  # Should be 18+

# Check npm installed
npm --version

# Check MySQL running
mysql --version
```

### 2. First Time Setup

**Backend Setup:**
```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL="mysql://root:password@localhost:3306/facebook_clone"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=5000
CLIENT_URL="http://localhost:5173"
EOF

# Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS facebook_clone;"

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

**Frontend Setup:**
```bash
# Navigate to client
cd client

# Install dependencies
npm install

# Create .env file (if needed)
cat > .env << EOF
VITE_API_URL="http://localhost:5000/api"
VITE_SOCKET_URL="http://localhost:5000"
EOF
```

### 3. Daily Development Start

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# App starts on http://localhost:5173
```

**Terminal 3 - Database (optional):**
```bash
# Open Prisma Studio to view/edit data
cd server
npx prisma studio
# Opens http://localhost:5555
```

### 4. Verify Everything Works

**Check Backend:**
```bash
# Test API endpoint
curl http://localhost:5000/api/auth/me
# Should return 401 (not authorized) - that's correct!
```

**Check Frontend:**
- Open http://localhost:5173 in browser
- Should see login page
- Check console for errors

**Check Database:**
```bash
cd server
npx prisma studio
# Should open database viewer
```

## Common Issues

**"Port 5000 already in use"**
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

**"Database connection failed"**
```bash
# Check MySQL is running
sudo systemctl start mysql

# Check credentials in .env
cat server/.env
```

**"Module not found"**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Project Structure
```
facebook-clone/
├── client/     # React frontend (port 5173)
├── server/     # Express backend (port 5000)
└── uploads/    # Image storage
```

## Useful URLs
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Prisma Studio | http://localhost:5555 |

## Output
- Backend running on port 5000
- Frontend running on port 5173
- Database connected
- Ready for development
