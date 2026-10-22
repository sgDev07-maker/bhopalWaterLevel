# Bhopal Smart Water

React + Vite frontend for the existing Bhopal Smart Water APIs.

There is **no Express backend**. During development, Vite proxies same-origin `/api` requests to the real servers so the browser does not hit CORS.

```text
Browser  →  /api/auth/login     →  userauth.../valuser
Browser  →  /api/analog/...     →  117.247.49.204/AppAnalogTagSVR/...
```

## Run

```bash
cd Water
npm install
npm run dev
```

Open http://localhost:5173

## Pages

- `/login`
- `/dashboard`
- `/zones`
- `/change-password`

Tank names, zones, tag IDs, capacities and heights come from the APK ESR-A dataset (128 tanks, no Zone 18). Live percentages come from `gettagsbyid`. No mock readings.

## Troubleshooting login

Chrome Network must show:

`POST http://localhost:5173/api/auth/login`

not the userauth host. A 200 body with `isSuccess: false` is an invalid password from the real API. A 502 previously happened when a separate Express process was used; that server has been removed.
