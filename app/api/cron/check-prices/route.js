import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { scrapeProduct } from "@/lib/firecrawl";
import { sendPriceDropAlert } from "@/lib/email";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use service role to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*");

    if (productsError) throw productsError;

    console.log(`Found ${products.length} products to check`);

    const results = {
      total: products.length,
      updated: 0,
      failed: 0,
      priceChanges: 0,
      alertsSent: 0,
    };

    for (const product of products) {
      try {
        /* --- TEST MODE: Use manual price from DB (start) --- */
        // const { data: lastHistory, error: historyError } = await supabase
        //   .from("price_history")
        //   .select("price")
        //   .eq("product_id", product.id)
        //   .order("id", { ascending: false })
        //   .limit(1)
        //   .single();
        //
        // const oldPrice = lastHistory ? parseFloat(lastHistory.price) : parseFloat(product.current_price);
        // const newPrice = parseFloat(product.current_price); // manual value
        // const productData = {
        //   currentPrice: newPrice,
        //   currencyCode: product.currency,
        //   productName: product.name,
        //   productImageUrl: product.image_url,
        // };
        /* --- TEST MODE: Use manual price from DB (end) --- */

        /* --- PRODUCTION MODE: Scrape price from product URL (start) --- */
        const productData = await scrapeProduct(product.url);
        if (!productData.currentPrice) {
          results.failed++;
          continue;
        }
        const newPrice = parseFloat(productData.currentPrice);
        // Fetch the last price from price_history for this product
        const { data: lastHistory, error: historyError } = await supabase
          .from("price_history")
          .select("price")
          .eq("product_id", product.id)
          .order("id", { ascending: false })
          .limit(1)
          .single();
        const oldPrice = lastHistory ? parseFloat(lastHistory.price) : parseFloat(product.current_price);
        /* --- PRODUCTION MODE: Scrape price from product URL (end) --- */

        await supabase
          .from("products")
          .update({
            current_price: newPrice,
            currency: productData.currencyCode || product.currency,
            name: productData.productName || product.name,
            image_url: productData.productImageUrl || product.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id);

        if (oldPrice !== newPrice) {
          await supabase.from("price_history").insert({
            product_id: product.id,
            price: newPrice,
            currency: productData.currencyCode || product.currency,
          });

          results.priceChanges++;

          if (newPrice < oldPrice) {
            const {
              data: { user },
            } = await supabase.auth.admin.getUserById(product.user_id);

            if (user?.email) {
              const emailResult = await sendPriceDropAlert(
                user.email,
                product,
                oldPrice,
                newPrice
              );

              if (emailResult.success) {
                results.alertsSent++;
              }
            }
          }
        }

        results.updated++;
      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error);
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Price check completed",
      results,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Price check endpoint is working. Use POST to trigger.",
  });
}

// curl -X POST https://pricedipdeals.vercel.app//api/cron/check-prices -H "Authorization: Bearer 0696ef7d02accbb0f96fdc1cd846b21c267bd81d8d0675b8bec026ccc88cd7c9"