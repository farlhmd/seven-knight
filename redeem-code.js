// Node.js 18+ (built-in fetch)

import fs from 'fs';
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

async function redeemCoupon(gameCode, couponCode, pidObj) {
  const url = new URL("https://coupon.netmarble.com/api/coupon/reward");

  url.searchParams.set("gameCode", gameCode);
  url.searchParams.set("couponCode", couponCode);
  url.searchParams.set("langCd", "EN_US");
  url.searchParams.set("pid", pidObj.id);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "accept": "application/json",
        "accept-language": "en-US",
        "referer": "https://coupon.netmarble.com/tskgb",
        // Required only if the API validates session
        // "cookie": "_ga=GA1.3.468054536.1767884651; _clck=lddw6s%5E2%5Eg2j%5E0%5E2199; _clsk=siukqq%5E1767884655817%5E1%5E0%5Eq.clarity.ms%2Fcollect; _ga_3MC57P48VK=GS2.3.s1767884650$o1$g1$t1767884677$j33$l0$h0"
      }
    });

    const responseData = await response.json();

    // Second API call: POST to /api/coupon
    const postResponse = await fetch("https://coupon.netmarble.com/api/coupon", {
      method: "POST",
      headers: {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "origin": "https://coupon.netmarble.com",
        "referer": "https://coupon.netmarble.com/tskgb"
      },
      body: JSON.stringify({
        gameCode,
        couponCode,
        langCd: "EN_US",
        pid: pidObj.id
      })
    });

    const postData = await postResponse.json();
    console.log(`POST for User ${pidObj.name} with coupon ${couponCode}:`, postData);
  } catch (err) {
    console.error(`User ${pidObj.name} failed to redeem coupon code: ${couponCode}:`, err);
  }
}
  for (const pidObj of data.pid) {
    for (const couponCode of data.couponCode) {
      
      await redeemCoupon(data.gameCode, couponCode, pidObj);
      // Optional delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

