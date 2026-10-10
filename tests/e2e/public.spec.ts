import { expect, test } from "@playwright/test";

const PAGES = [
  { path: "/", heading: /CELEBRATION NIGHT 2026/i },
  { path: "/a-propos", heading: /Qu'est-ce que CELEBRATION NIGHT/i },
  { path: "/intervenants", heading: /Intervenants/i },
  { path: "/programme", heading: /Programme/i },
  { path: "/galerie", heading: /Photos & vidéos/i },
  { path: "/archives", heading: /éditions précédentes/i },
  { path: "/partenaires", heading: /édition d'excellence/i },
  { path: "/inscription", heading: /Je m'inscris/i },
  { path: "/contact", heading: /Écrivez-nous/i },
];

for (const { path, heading } of PAGES) {
  test(`${path} s'affiche sans debordement horizontal`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("aucune information inventee n'apparait sur l'accueil", async ({ page }) => {
  await page.goto("/");
  const text = await page.locator("body").innerText();
  for (const forbidden of [/Abidjan/i, /14 novembre 2026/i, /VIP/, /HAGIAZO Ministry/i, /\+225/]) {
    expect(text).not.toMatch(forbidden);
  }
  await expect(page.getByText("Vendredi 13 novembre 2026").first()).toBeVisible();
});

test("une proposition est signalee comme non confirmee", async ({ page }) => {
  await page.goto("/intervenants");
  const card = page.getByRole("article").filter({ hasText: "Héribert Donald" });
  await expect(card.getByText("Proposition — à confirmer")).toBeVisible();
});

test("les anciennes adresses redirigent", async ({ page }) => {
  await page.goto("/artistes");
  await expect(page).toHaveURL(/\/intervenants$/);
  await page.goto("/notre-histoire");
  await expect(page).toHaveURL(/\/a-propos$/);
});

test("le formulaire d'inscription refuse un envoi incomplet", async ({ page }) => {
  await page.goto("/inscription");
  await page.getByRole("button", { name: /Confirmer mon inscription/ }).click();
  await expect(page.getByText("Indiquez votre prénom.")).toBeVisible();
  await expect(page.getByText("Votre accord est nécessaire pour vous inscrire.")).toBeVisible();
});

test("parcours d'inscription complet jusqu'a la confirmation", async ({ page }) => {
  await page.goto("/inscription");
  await page.locator("#firstName").fill("Parcours");
  await page.locator("#lastName").fill("Test");
  await page.locator("#phone").fill("+229 01 00 00 00 00");
  await page.locator("#city").fill("Cotonou");
  await page.getByRole("button", { name: "Ajouter une place" }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Confirmer mon inscription/ }).click();
  await expect(page).toHaveURL(/\/mes-billets\?nouveau=1#cle=[A-Za-z0-9_-]{43}$/);
  await expect(page.getByText("Inscription confirmée")).toBeVisible();
  await expect(page.getByRole("img", { name: /QR code du billet CN-2026-\d{6}/ })).toHaveCount(2);

  // Sans la cle, les billets ne s'affichent pas.
  await page.goto("/mes-billets");
  await expect(page.getByRole("heading", { name: "Lien incomplet" })).toBeVisible();

  // Retrouver ses billets par telephone + nom genere un nouveau lien.
  await page.goto("/mon-billet");
  await page.locator("#recover-phone").fill("0100000000");
  await page.locator("#recover-name").fill("TEST");
  await page.getByRole("button", { name: /Retrouver mes billets/ }).click();
  await expect(page).toHaveURL(/\/mes-billets#cle=[A-Za-z0-9_-]{43}$/);
  await expect(page.getByRole("img", { name: /QR code du billet/ })).toHaveCount(2);
});

test("les billets ne sont pas accessibles par simple numero", async ({ request }) => {
  expect((await request.get("/api/ticket/CN-2026-000001")).status()).toBe(404);
  const res = await request.post("/api/billets", { data: { cle: "a".repeat(43) } });
  expect(res.status()).toBe(404);
  const body = await res.text();
  expect(body).not.toContain("svg");
});

test("le scanner refuse un QR code contenant un numero de billet", async ({ request }) => {
  // Sans session admin : refuse d'emblee.
  const res = await request.post("/api/admin/scan", { data: { tokenOrNumber: "CN-2026-000001" } });
  expect(res.status()).toBe(401);
});
