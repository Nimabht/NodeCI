jest.setTimeout(600000); // 30 seconds
const customPage = require("./helpers/page");
let page;

beforeEach(async () => {
  page = await customPage.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

test("CHECK HEADER LOGO TEXT", async () => {
  const text = await page.getContentOf("a.brand-logo");

  expect(text).toEqual("Blogster");
});

test("CLICKING ON LOGIN WITH GOOGLE", async () => {
  // Click on the login link
  await page.click('div.nav-wrapper ul.right li a[href="/auth/google"]');
  // Get the current URL
  const currentUrl = await page.url();
  // Check if the URL starts with the expected Google OAuth URL
  expect(currentUrl.startsWith("https://accounts.google.com")).toBe(true);
});

test("WHEN SIGNED IN MUST SEE LOGOUT BUTTON", async () => {
  await page.loginUser();

  await page.goto("http://localhost:3000");

  await page.waitFor("a[href='/auth/logout']");

  const text = await page.getContentOf("a[href='/auth/logout']");

  expect(text).toEqual("Logout");
});

test("CREATE A NEW BLOG", async () => {
  await page.loginUser();

  await page.goto("http://localhost:3000/blogs");

  await page.waitFor("a[href='/blogs/new']");

  await page.click("a[href='/blogs/new']");

  const text = await page.getContentOf("div.title label");

  const uniqueTitle = `Title_${Date.now()}`;
  await page.type("div.title input", uniqueTitle);

  const uniqueContnet = `Content_${Date.now()}`;
  await page.type("div.content input", uniqueContnet);

  await page.click("button[type='submit']");

  await page.waitFor("button[class='green btn-flat right white-text']");

  await page.click("button[class='green btn-flat right white-text']");

  await page.goto("http://localhost:3000/blogs");

  await page.goto("http://localhost:3000/blogs");

  const firstTitle = await page.$$eval(
    "div.card-content span.card-title",
    (spans) => spans.map((span) => span.innerHTML),
  );

  const firstContect = await page.$$eval("div.card-content p", (ps) =>
    ps.map((p) => p.innerHTML),
  );

  expect(text).toEqual("Blog Title");
  expect(firstTitle[0]).toEqual(uniqueTitle);
  expect(firstContect[0]).toEqual(uniqueContnet);
});
