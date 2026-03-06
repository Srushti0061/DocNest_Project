# Vercel Deployment Guide

## Project Structure
This is a MERN stack application with:
- **Backend**: Node.js/Express API in `backend/` directory
- **Frontend**: React/Vite application in `vite-frontend/` directory

## Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Set Environment Variables
Before deploying, set these environment variables in your Vercel dashboard or via CLI:

```bash
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add NODE_ENV
```

**Required Environment Variables:**
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key
- `NODE_ENV`: Set to `production`

### 4. Deploy to Vercel
```bash
# From the project root directory
vercel --prod
```

## Configuration Files Created

### `vercel.json`
- Configures build settings for both frontend and backend
- Sets up routing for API calls and static files
- Handles serverless function deployment

### `backend/api/index.js`
- Vercel-compatible API entry point
- Exports Express app for serverless deployment

### `backend/package.json`
- Complete dependencies for the backend
- Build and start scripts

### `.env.example`
- Template for required environment variables

## Important Notes

1. **File Uploads**: The uploads directory is handled dynamically in the serverless environment
2. **Database**: Ensure your MongoDB Atlas allows access from Vercel's IP ranges
3. **API Routes**: All API calls are prefixed with `/api/` and routed to the backend
4. **Static Files**: Frontend build output is served from the root path

## Troubleshooting

### Common Issues:
1. **MongoDB Connection**: Make sure your MongoDB URI is correct and accessible
2. **Build Failures**: Check that all dependencies are properly installed
3. **Route Not Found**: Ensure API calls use the `/api/` prefix

### Debug Commands:
```bash
# Check deployment logs
vercel logs

# Redeploy
vercel --prod --force
```

## Post-Deployment
1. Test all API endpoints in the deployed environment
2. Verify file uploads work correctly
3. Check database connectivity
4. Test user authentication flows
