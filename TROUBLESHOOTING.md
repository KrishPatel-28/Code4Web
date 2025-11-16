# Troubleshooting 404 Errors

If you're getting 404 errors when making API requests, follow these steps:

## 1. Verify Both Servers Are Running

Make sure both servers are running:
- **API Server**: Should be on `http://localhost:3000`
- **Vite Dev Server**: Should be on `http://localhost:5173`

Check your terminal - you should see:
```
API server running on http://localhost:3000
VITE v5.x.x  ready in xxx ms
```

## 2. Test the API Server Directly

Open your browser and go to:
```
http://localhost:3000/api/health
```

You should see: `{"ok":true}`

If this doesn't work, the API server isn't running properly.

## 3. Check the Vite Proxy

The Vite proxy should forward `/api/*` requests to `http://localhost:3000`.

Verify `vite.config.js` has:
```js
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false
  }
}
```

## 4. Restart Both Servers

1. Stop both servers (Ctrl+C in terminal)
2. Run `npm run dev` again
3. Wait for both servers to start

## 5. Check Browser Console

Open browser DevTools (F12) and check:
- **Console tab**: Look for any errors
- **Network tab**: Check the request URL and status

The request should show:
- **Request URL**: `http://localhost:5173/api/templates`
- **Status**: Should be 200 (not 404)
- **Response**: Should come from the API server

## 6. Common Issues

### Issue: "Failed to load resource: 404"
**Solution**: API server isn't running or route isn't matching

### Issue: CORS errors
**Solution**: Check that CORS headers are set in `server/dev-server.js`

### Issue: Proxy not working
**Solution**: 
1. Restart Vite dev server
2. Check `vite.config.js` proxy configuration
3. Try accessing API directly at `http://localhost:3000/api/templates`

## 7. Manual Test

Test the API directly using curl or Postman:
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test templates endpoint
curl http://localhost:3000/api/templates
```

If these work but the browser requests don't, it's a proxy issue.

## 8. Check Server Logs

The API server now logs all requests. Check your terminal for:
```
POST /api/templates
GET /api/templates
```

If you don't see these logs, the request isn't reaching the API server.

