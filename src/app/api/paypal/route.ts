// src/app/api/paypal/route.ts
import { NextResponse } from 'next/server';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Use PayPal's sandbox environment for testing, or production for live transactions
const base = process.env.NODE_ENV === 'production' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com';

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal's API.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const generateAccessToken = async () => {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("MISSING_PAYPAL_API_CREDENTIALS");
  }
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const data = await response.json();
  return data.access_token;
};


/**
 * Create a PayPal order.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
async function createOrder(price: string) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;

  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: price,
        },
      },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

/**
 * Capture a payment for a PayPal order.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
async function captureOrder(orderID: string) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
}

// POST handler to create an order
export async function POST(request: Request) {
  try {
    const { price } = await request.json();
    if (!price) {
        return NextResponse.json({ error: 'Price is required' }, { status: 400 });
    }
    const orderData = await createOrder(price);
    return NextResponse.json(orderData);
  } catch (error: any) {
    console.error("Failed to create order:", error);
    return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
  }
}

// PUT handler to capture an order
export async function PUT(request: Request) {
    try {
        const { orderID, machineId } = await request.json();
        if (!orderID || !machineId) {
            return NextResponse.json({ error: 'Order ID and Machine ID are required' }, { status: 400 });
        }
        
        const captureData = await captureOrder(orderID);

        // Check if payment was successful
        if (captureData.status === 'COMPLETED') {
            // --- YOUR SERIAL NUMBER LOGIC GOES HERE ---
            // This is where you would take the `machineId`, generate a real
            // serial number, and save the transaction details to your database.
            // For now, we'll just create a placeholder serial.
            const placeholderSerial = `SERIAL-${machineId}-${Date.now()}`;
            
            return NextResponse.json({ serialNumber: placeholderSerial, ...captureData });
        } else {
             throw new Error(captureData.details?.[0]?.description || 'Payment not completed.');
        }

    } catch (error: any) {
        console.error("Failed to capture order:", error);
        return NextResponse.json({ error: `Failed to capture order: ${error.message}` }, { status: 500 });
    }
}
