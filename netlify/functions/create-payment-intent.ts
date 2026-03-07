import type { Handler } from "@netlify/functions";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
    throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(stripeSecret);

type RequestBody = {
    amount: number;
};

export const handler: Handler = async (event) => {
    try {
        const { amount } = JSON.parse(event.body ?? "{}") as RequestBody;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                clientSecret: paymentIntent.client_secret
            }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ 
                error: error instanceof Error ? error.message : "Unknown error",
            }),
        };
    }
};