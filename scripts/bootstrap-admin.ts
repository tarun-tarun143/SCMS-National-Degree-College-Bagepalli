import { config } from "dotenv";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Load environment variables.
// .env.local takes precedence over .env.
config({ path: ".env.local" });
config({ path: ".env", override: false });

function getArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  return arg?.slice(prefix.length).trim();
}

async function main(): Promise<void> {
  try {
    // ------------------------------------------------------------
    // ADMIN EMAIL
    // ------------------------------------------------------------
    const email =
      getArg("email") ||
      process.env.ADMIN_EMAIL?.trim();

    if (!email) {
      throw new Error(
        "Set ADMIN_EMAIL in .env.local or pass --email=admin@example.com"
      );
    }

    // ------------------------------------------------------------
    // FIREBASE ADMIN CREDENTIALS
    // ------------------------------------------------------------
    const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();

    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ?.replace(/\\n/g, "\n")
      .trim();

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env.local before bootstrapping the first admin."
      );
    }

    // ------------------------------------------------------------
    // INITIALIZE FIREBASE ADMIN SDK
    // ------------------------------------------------------------
    const app =
      getApps()[0] ??
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

    const auth = getAuth(app);
    const db = getFirestore(app);

    // ------------------------------------------------------------
    // FIND GOOGLE/FIREBASE AUTH USER
    // ------------------------------------------------------------
    let user;

    try {
      user = await auth.getUserByEmail(email);
    } catch (error: unknown) {
      const errorCode =
        typeof error === "object" &&
        error !== null &&
        "code" in error
          ? String((error as { code: unknown }).code)
          : "";

      if (errorCode === "auth/user-not-found") {
        throw new Error(
          `No Firebase Authentication user was found for ${email}.\n\n` +
            `First sign in to the SCMS website using Google with this email:\n` +
            `${email}\n\n` +
            `Then run this bootstrap command again.`
        );
      }

      throw error;
    }

    // ------------------------------------------------------------
    // CREATE / UPDATE USERS COLLECTION
    // ------------------------------------------------------------
    await db.collection("users").doc(user.uid).set(
      {
        uid: user.uid,
        name: user.displayName ?? email.split("@")[0],
        email: user.email ?? email,
        photoURL: user.photoURL ?? "",
        role: "admin",
        status: "active",
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // ------------------------------------------------------------
    // CREATE / UPDATE ADMINS COLLECTION
    // ------------------------------------------------------------
    await db.collection("admins").doc(user.uid).set(
      {
        uid: user.uid,
        email: user.email ?? email,
        name: user.displayName ?? email.split("@")[0],
        designation: "Super Administrator",
        status: "active",
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // ------------------------------------------------------------
    // SUCCESS
    // ------------------------------------------------------------
    console.log("");
    console.log("==============================================");
    console.log("       SCMS ADMIN BOOTSTRAP SUCCESS");
    console.log("==============================================");
    console.log("");
    console.log(`Admin Email : ${email}`);
    console.log(`User UID    : ${user.uid}`);
    console.log(`Project ID  : ${projectId}`);
    console.log("");
    console.log("Role        : admin");
    console.log("Status      : active");
    console.log("");
    console.log(
      "The user can now sign in at /login with Google."
    );
    console.log("");
    console.log("==============================================");
  } catch (error: unknown) {
    console.error("");
    console.error("==============================================");
    console.error("       SCMS ADMIN BOOTSTRAP FAILED");
    console.error("==============================================");
    console.error("");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    console.error("");
    process.exitCode = 1;
  }
}

void main();