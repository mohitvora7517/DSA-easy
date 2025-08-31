# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. 404 Error During Login

**Problem**: Getting 404 error when trying to login or access the application.

**Solutions**:

1. **Check if servers are running**:
   ```bash
   # Make sure both servers are running
   npm run dev
   ```

2. **Verify MongoDB connection**:
   ```bash
   # Check if MongoDB is running
   mongosh
   # Or check the connection string in backend/.env
   ```

3. **Check environment variables**:
   - Make sure `backend/.env` exists with correct MongoDB URI
   - Make sure `frontend/.env.local` exists with API URL

4. **Clear browser cache and localStorage**:
   - Open browser dev tools (F12)
   - Go to Application tab
   - Clear localStorage
   - Refresh the page

### 2. Database Connection Issues

**Problem**: "MongoDB connection error" in backend logs.

**Solutions**:

1. **Local MongoDB**:
   ```bash
   # Start MongoDB service
   # macOS:
   brew services start mongodb-community
   
   # Ubuntu:
   sudo systemctl start mongod
   
   # Windows:
   net start MongoDB
   ```

2. **MongoDB Atlas (Cloud)**:
   - Update `MONGODB_URI` in `backend/.env`
   - Make sure IP is whitelisted in Atlas
   - Check username/password

3. **Test connection**:
   ```bash
   cd backend
   node -e "require('mongoose').connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa-game').then(() => console.log('Connected!')).catch(console.error)"
   ```

### 3. Code Execution Not Working

**Problem**: Code editor runs but doesn't execute properly.

**Solutions**:

1. **Check Python installation**:
   ```bash
   python3 --version
   # Should be Python 3.6+
   ```

2. **Check Node.js version**:
   ```bash
   node --version
   # Should be Node.js 16+
   ```

3. **Verify file permissions**:
   ```bash
   # Make sure temp directory is writable
   ls -la backend/temp/
   ```

### 4. Frontend Build Issues

**Problem**: Frontend fails to build or has TypeScript errors.

**Solutions**:

1. **Clear Next.js cache**:
   ```bash
   cd frontend
   rm -rf .next
   npm run build
   ```

2. **Reinstall dependencies**:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check TypeScript errors**:
   ```bash
   cd frontend
   npx tsc --noEmit
   ```

### 5. Authentication Issues

**Problem**: Login works but user data doesn't persist.

**Solutions**:

1. **Check JWT secret**:
   - Make sure `JWT_SECRET` is set in `backend/.env`
   - Use a long, random string

2. **Check token storage**:
   - Open browser dev tools
   - Check if token is stored in localStorage
   - Verify token format

3. **Check CORS settings**:
   - Make sure `CLIENT_URL` is correct in `backend/.env`
   - Should be `http://localhost:3000` for development

### 6. Port Already in Use

**Problem**: "Port 3000/5000 already in use" error.

**Solutions**:

1. **Kill existing processes**:
   ```bash
   # Find processes using the ports
   lsof -ti:3000 | xargs kill -9
   lsof -ti:5000 | xargs kill -9
   ```

2. **Use different ports**:
   ```bash
   # Backend
   PORT=5001 npm run dev
   
   # Frontend
   cd frontend && PORT=3001 npm run dev
   ```

### 7. Database Seeding Issues

**Problem**: Database is empty or seeding fails.

**Solutions**:

1. **Run seed script manually**:
   ```bash
   cd backend
   npm run seed
   ```

2. **Check database connection first**:
   ```bash
   cd backend
   node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected!')).catch(console.error)"
   ```

3. **Clear and reseed**:
   ```bash
   cd backend
   node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => { require('./models/Level').deleteMany({}); require('./models/Problem').deleteMany({}); require('./models/Achievement').deleteMany({}); console.log('Cleared!'); process.exit(0); })"
   npm run seed
   ```

## Quick Start Checklist

1. ✅ MongoDB is running (local or Atlas)
2. ✅ Environment files exist (`backend/.env`, `frontend/.env.local`)
3. ✅ Dependencies installed (`npm run install-all`)
4. ✅ Database seeded (`cd backend && npm run seed`)
5. ✅ Servers started (`npm run dev`)
6. ✅ Browser cache cleared
7. ✅ Check browser console for errors

## Getting Help

If you're still having issues:

1. Check the browser console (F12) for JavaScript errors
2. Check the backend terminal for server errors
3. Verify all environment variables are set correctly
4. Make sure all dependencies are installed
5. Try the step-by-step setup in the main README

## Development Tips

- Use `npm run dev` to start both servers
- Check `http://localhost:5000/api/health` to verify backend is running
- Use browser dev tools to inspect network requests
- Check MongoDB Compass to verify data is being stored
- Use `console.log()` statements to debug issues