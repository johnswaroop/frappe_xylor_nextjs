# Base Path Usage Instructions for Xylor Next.js Application

## Overview

Your Next.js application is configured with a base path of `/xylor-ai`. This means all routes and assets will be prefixed with this path when deployed.

## Current Configuration

The base path is configured in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  basePath: "/xylor-ai",
  // other config options
};
```

## Usage Instructions

### 1. Routing and Navigation

#### Using Next.js Router

When using Next.js navigation, the base path is automatically handled:

```typescript
import { useRouter } from "next/navigation";

// ✅ Correct - Next.js handles the base path automatically
router.push("/dashboard"); // Will navigate to /xylor-ai/dashboard

// ✅ Correct - Link component also handles base path
import Link from "next/link";
<Link href="/about">About</Link>; // Will navigate to /xylor-ai/about
```

#### Manual URL Construction

If you need to construct URLs manually:

```typescript
// ✅ Correct - Use process.env.NEXT_PUBLIC_BASEPATH or hardcode
const baseUrl = process.env.NEXT_PUBLIC_BASEPATH || "/xylor-ai";
const fullUrl = `${baseUrl}/api/data`;

// Or use Next.js utility if available
import { useRouter } from "next/router";
const router = useRouter();
const fullPath = router.basePath + "/api/data";
```

### 2. Static Assets

#### Images and Public Files

Static assets in the `public` folder are automatically prefixed:

```typescript
// ✅ Correct - Next.js handles the base path
<img src="/logo.png" alt="Logo" />; // Serves from /xylor-ai/logo.png

// ✅ Correct - Using Next.js Image component
import Image from "next/image";
<Image src="/hero-image.jpg" alt="Hero" width={500} height={300} />;
```

### 3. API Routes

#### Calling API Routes

API routes are also prefixed with the base path:

```typescript
// ✅ Correct - Relative paths work automatically
fetch("/api/users").then((res) => res.json()); // Calls /xylor-ai/api/users

// ✅ Correct - Using full path construction
const baseUrl = process.env.NEXT_PUBLIC_BASEPATH || "/xylor-ai";
fetch(`${baseUrl}/api/users`).then((res) => res.json());
```

### 4. Environment Variables (Recommended)

Add to your `.env.local`:

```bash
NEXT_PUBLIC_BASEPATH=/xylor-ai
```

Then use it throughout your application:

```typescript
const basePath = process.env.NEXT_PUBLIC_BASEPATH || "";
```

### 5. Development vs Production

#### Development

- Run `npm run dev` - the app runs on `http://localhost:3000/xylor-ai`
- All routes are automatically prefixed

#### Production

- After `npm run build && npm run start`
- The app expects to be served from `/xylor-ai` path on your domain
- Example: `https://yourdomain.com/xylor-ai`

### 6. Common Patterns

#### Conditional Base Path

```typescript
// For components that need to be aware of base path
const getBasePath = () => {
  return process.env.NODE_ENV === "production" ? "/xylor-ai" : "";
};
```

#### Absolute URLs

```typescript
// When you need absolute URLs (for meta tags, etc.)
const getAbsoluteUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const basePath = process.env.NEXT_PUBLIC_BASEPATH || "/xylor-ai";
  return `${baseUrl}${basePath}${path}`;
};
```

### 7. Deployment Considerations

#### Web Server Configuration

Ensure your web server (Nginx, Apache, etc.) is configured to serve the app from the `/xylor-ai` path:

```nginx
# Nginx example
location /xylor-ai {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

#### Static Deployment

If deploying to a static host:

- The `out` folder (after `next export`) will contain files organized for the base path
- Upload to your server so the files are accessible at `/xylor-ai`

### 8. Testing the Base Path

#### Local Testing

```bash
# Start development server
npm run dev

# Visit: http://localhost:3000/xylor-ai
```

#### Build Testing

```bash
# Build and start production server
npm run build
npm run start

# Visit: http://localhost:3000/xylor-ai
```

### 9. Common Issues and Solutions

#### Issue: Links not working

**Problem:** Using hardcoded absolute paths

```typescript
// ❌ Wrong
<Link href="https://yourdomain.com/dashboard">Dashboard</Link>
```

**Solution:** Use relative paths

```typescript
// ✅ Correct
<Link href="/dashboard">Dashboard</Link>
```

#### Issue: Assets not loading

**Problem:** Hardcoded asset paths without base path

```typescript
// ❌ Wrong
<img src="https://yourdomain.com/logo.png" />
```

**Solution:** Use relative paths

```typescript
// ✅ Correct
<img src="/logo.png" />
```

### 10. Quick Reference

| Context        | Example                     | Resolves To                      |
| -------------- | --------------------------- | -------------------------------- |
| Link component | `<Link href="/about">`      | `/xylor-ai/about`                |
| Router push    | `router.push('/dashboard')` | `/xylor-ai/dashboard`            |
| Static asset   | `<img src="/logo.png">`     | `/xylor-ai/logo.png`             |
| API call       | `fetch('/api/users')`       | `/xylor-ai/api/users`            |
| Direct browser | Visit manually              | `http://localhost:3000/xylor-ai` |

## Summary

The base path `/xylor-ai` is handled automatically by Next.js for most use cases. Stick to relative paths and let Next.js handle the prefixing. Only construct absolute URLs when absolutely necessary, and always use environment variables for configuration.
