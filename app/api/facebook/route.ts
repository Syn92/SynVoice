import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const FACEBOOK_API_VERSION = "v21.0";

function hashData(data: string): string {
  return createHash("sha256").update(data.toLowerCase().trim()).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const facebookToken = process.env.FACEBOOK_TOKEN;
    const facebookPixelId = process.env.FACEBOOK_PIXEL_ID;

    if (!facebookToken) {
      return NextResponse.json(
        { error: "FACEBOOK_TOKEN not configured" },
        { status: 500 }
      );
    }

    if (!facebookPixelId) {
      return NextResponse.json(
        { error: "FACEBOOK_PIXEL_ID not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { 
      eventName, 
      eventTime, 
      eventSourceUrl, 
      userAgent, 
      fbc, 
      fbp,
      email,
      firstName,
      lastName,
      phone,
      zipCode,
      country
    } = body;

    const clientIpAddress = 
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined;

    const userData: Record<string, any> = {};

    if (userAgent) {
      userData.client_user_agent = userAgent;
    }

    if (clientIpAddress) {
      userData.client_ip_address = clientIpAddress;
    }

    if (fbc) {
      userData.fbc = fbc;
    }

    if (fbp) {
      userData.fbp = fbp;
    }

    if (email) {
      userData.em = [hashData(email)];
    }

    if (firstName) {
      userData.fn = [hashData(firstName)];
    }

    if (lastName) {
      userData.ln = [hashData(lastName)];
    }

    if (phone) {
      const cleanedPhone = phone.replace(/\D/g, "");
      if (cleanedPhone) {
        userData.ph = [hashData(cleanedPhone)];
      }
    }

    if (zipCode) {
      userData.zp = [hashData(zipCode)];
    }

    if (country) {
      userData.country = [hashData(country)];
    }

    const eventId = `${eventName || "ViewContent"}_${eventTime || Math.floor(Date.now() / 1000)}_${Math.random().toString(36).substring(2, 15)}`;

    const eventData: Record<string, any> = {
      event_name: eventName || "ViewContent",
      event_time: eventTime || Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: eventSourceUrl,
      event_id: eventId,
      user_data: userData,
    };

    const payload = {
      data: [eventData],
    };

    const facebookUrl = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${facebookPixelId}/events?access_token=${facebookToken}`;

    const response = await fetch(facebookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Facebook API error:", result);
      return NextResponse.json(
        { error: "Facebook API error", details: result },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error sending Facebook event:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

