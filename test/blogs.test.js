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

describe("WHEN LOGGED IN", async () => {
  beforeEach(async () => {
    await page.loginUser();
    await page.goto("http://localhost:3000/blogs");
    await page.waitFor("a[href='/blogs/new']");
    await page.click("a[href='/blogs/new']");
  });

  test("CREATE A NEW BLOG", async () => {
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

    await page.waitFor("div.card-content span.card-title");

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

  describe("USING INVALID INPUTS", async () => {
    test("THE FORM SHOWS ERROR MESSAGE", async () => {
      await page.click("button[type='submit']");
      const errorMessage = await page.getContentOf(
        "form div.title div[class='red-text']",
      );
      expect(errorMessage).toEqual("You must provide a value");
    });
  });
});

describe("WHEN NOT LOGGED IN", async () => {
  test("USER CANNOT POST ANY BLOGS", async () => {
    const result = await page.post("/api/blogs", {
      title: "My Title",
      content: "My Content",
    });
    expect(result).toEqual({ error: "You must log in!" });
  });
});
