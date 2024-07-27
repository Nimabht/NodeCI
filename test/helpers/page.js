const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

module.exports = class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page, browser);

    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || page[property] || browser[property];
      },
    });
  }

  constructor(page, browser) {
    this.page = page;
    this.browser = browser;
  }

  async close() {
    await this.browser.close();
  }

  async loginUser() {
    const user = await userFactory();
    const { session, sig } = await sessionFactory(user);

    await this.page.setCookie({
      name: "session",
      value: session,
    });

    await this.page.setCookie({
      name: "session.sig",
      value: sig,
    });
  }

  async getContentOf(selector) {
    return await this.page.$eval(selector, (el) => el.innerHTML);
  }

  async post(url, data) {
    return await this.page.evaluate(
      ({ url, data }) => {
        return fetch(url, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }).then((val) => val.json());
      },
      { url, data },
    );
  }
};
