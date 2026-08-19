import { NextRequest, NextResponse } from "next/server";
import {
  getAdminAuth,
  getAdminDb,
} from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{ queryId: string }>;
  }
) {
  try {
    const { queryId } = await context.params;

    if (!queryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Query ID is required.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // VERIFY ADMIN TOKEN
    // ---------------------------------------

    const authorization =
      request.headers.get("authorization");

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    const idToken =
      authorization.substring("Bearer ".length);

    const adminAuth = getAdminAuth();

    const decodedToken =
      await adminAuth.verifyIdToken(idToken);

    // ---------------------------------------
    // VERIFY SCMS ADMIN ROLE
    // ---------------------------------------

    const adminDb = getAdminDb();

    const userRef = adminDb
      .collection("users")
      .doc(decodedToken.uid);

    const userSnapshot =
      await userRef.get();

    if (!userSnapshot.exists) {
      return NextResponse.json(
        {
          success: false,
          message:
            "SCMS user profile not found.",
        },
        { status: 403 }
      );
    }

    const userData =
      userSnapshot.data() as {
        role?: string;
        status?: string;
      };

    if (
      userData.role !== "admin" ||
      userData.status !== "active"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Active admin access required.",
        },
        { status: 403 }
      );
    }

    // ---------------------------------------
    // FIND QUERY
    // ---------------------------------------

    const queryRef = adminDb
      .collection("queries")
      .doc(queryId);

    const querySnapshot =
      await queryRef.get();

    if (!querySnapshot.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Query not found.",
        },
        { status: 404 }
      );
    }

    // ---------------------------------------
    // DELETE QUERY
    // ---------------------------------------

    await queryRef.delete();

    return NextResponse.json(
      {
        success: true,
        message:
          "Query deleted successfully.",
        queryId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "DELETE QUERY ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete query.",
      },
      { status: 500 }
    );
  }
}