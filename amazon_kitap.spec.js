const { test, expect } = require("@playwright/test");

test("Amazon üzerinden kitap arama", async ({ page }) => {
  // 1. Amazon'a git
  await page.goto("https://www.amazon.com.tr/");

  // Varsa çerez onayını geç
  const cookieButton = page.locator("#sp-cc-accept");
  if (await cookieButton.isVisible()) {
    await cookieButton.click();
  }

  // 2. Arama kutusuna kitabın adını yaz ve Enter'a bas
  const searchBox = page.locator("#twotabsearchtextbox");
  await searchBox.fill("Bir İdam Mahkumunun Son Günü");
  await searchBox.press("Enter");

  // 3. Sonuçların listelendiği alanı bekle
  await page.waitForSelector(".s-main-slot");

  // 4. İlk kitabın başlığını al ve kontrol et
  const firstResult = page.locator(".s-main-slot .s-result-item h2").first();
  const bookTitle = await firstResult.innerText();

  console.log("-----------------------------------");
  console.log(`Bulunan ilk ürün: ${bookTitle}`);
  console.log("-----------------------------------");

  // 5. İlk sonuca tıkla
  await firstResult.click();

  // Kitap sayfasında olduğumuzu teyit et
  await expect(page).toHaveTitle(/Bir İdam Mahkumunun Son Günü/);

  // Sonucu görmen için 3 saniye bekle
  await page.waitForTimeout(3000);
});
