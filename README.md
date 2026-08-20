# Smart College Management System (SCMS)

## The National Degree College, Bagepalli

A real-time Next.js + Firebase college management platform with a public college website and separate Student, Faculty and Admin portals.

### Included

- Professional responsive public college website
- Real Google Authentication with Firebase Authentication
- Firestore-backed role and account management
- Pending-account workflow for new Google users
- Separate Student portal
- Separate Faculty portal
- Single Admin portal
- Live Firestore listeners for public courses, departments, notices, events and core dashboard records
- Secure role-based Firestore rules
- First-admin bootstrap command
- Admin user and role management page
- No Firebase Storage usage
- Upload abstraction prepared for local uploads or Cloudinary
- Professional responsive UI
- `Made by Tarun D` developer showcase in the footer

## Requirements

- Node.js 20+
- npm 10+
- A Firebase project with Authentication and Cloud Firestore enabled

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

On Windows CMD, copy the file manually or use:

```cmd
copy .env.example .env.local
```

Open http://localhost:3000

## Firebase Web App

Create a Firebase Web App and copy its public configuration into `.env.local`:

```text
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

ADMIN_EMAIL=
```

Enable Google in Firebase Authentication and add your development and production domains to the Authentication authorized domains list.

## Firestore

Deploy the provided rules and indexes:

```bash
firebase login
firebase use <your-project-id>
firebase deploy --only firestore
```

The rules use Firebase Authentication plus Firestore role records for authorization. Firebase documents recommend securing web/mobile Firestore access with Authentication and Security Rules rather than open database rules. citeturn955291search2turn955291search3

## Real account flow

1. A user signs in with Google at `/login`.
2. A first-time user receives a Firestore `users/{uid}` document with `role: pending` and `status: pending`.
3. Pending users cannot open private portal pages.
4. The first administrator is activated with the server-only bootstrap command.
5. The administrator uses `/admin/users` to assign Student, Faculty or Admin roles.
6. Portal access is then determined from Firebase Authentication + the live Firestore user record.

## First admin

Create a Firebase service account with access to the project. Put the server-only credentials in `.env.local`:

```text
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

Then, after the intended administrator has signed in once with Google:

```bash
npm run bootstrap:admin

The provided SCMS package is preconfigured with `ADMIN_EMAIL=tarund18303@gmail.com`; you may override it temporarily with `--email=...`.
```

Never commit service-account credentials.

## Admin user management

Open `/admin/users`. The page subscribes to the `users` collection in real time and allows an active administrator to provision or disable accounts.

## No Firebase Storage

Firebase Storage is intentionally not used anywhere in the project. The Firebase client configuration does not initialize Storage, and there are no Firebase Storage API calls.

## Uploads

Use the provider abstraction in `lib/upload.ts`. Configure:

```text
UPLOAD_PROVIDER=local
```

or:

```text
UPLOAD_PROVIDER=cloudinary
```

Cloudinary secrets are server-only.

## Development quality checks

```bash
npm run typecheck
npm run build
npm start
```

## Public routes

```text
/
/about
/courses
/departments
/faculty
/admissions
/events
/notices
/contact
/login
```

## Secure portal routes

```text
/student/*
/faculty/*
/admin/*
```

## Important

The website no longer contains a demo login or localStorage-based demo session. It requires a real Firebase Authentication identity and an active Firestore role for private portal access.

The public-facing course, department, notice and event sections use live Firestore listeners, so changes made by an authorized administrator propagate to connected users automatically.

# SCMS Profile System

Files for a production-style `/profile` system using the existing Firebase Auth + Firestore client architecture.

## Required packages

```cmd
npm install react-hook-form zod @hookform/resolvers framer-motion
```

## Files

- `app/profile/page.tsx`
- `components/profile/ProfileForm.tsx`
- `components/profile/ProfilePhotoEditor.tsx`
- `components/profile/ProfileHeader.tsx`
- `components/profile/ProfileCompletion.tsx`
- `components/profile/ProfileSkeleton.tsx`
- `components/profile/SecuritySettings.tsx`
- `lib/profile.ts`
- `types/profile.ts`

## Photo handling

No Firebase Storage is used. The browser validates the image, resizes it to a maximum of 512x512, converts it to WebP, and keeps the result as a data URL for Firestore.

The implementation rejects processed output that is still too large for practical Firestore document storage.

## Integration notes

- The page uses the existing `useScmsSession()` and `firebaseAuth` / `firestoreDb` exports.
- Academic identifiers such as student ID/USN and employee ID are displayed as read-only.
- The role is never editable from the profile form.
- `scms-profile-updated` is dispatched after save so existing navbar/profile UI can refresh immediately.
- Add the linked profile route to your existing portal navigation if it is not already present.


## Developer

**Made by Tarun D**
