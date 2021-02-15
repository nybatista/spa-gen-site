const { remote } = require('webdriverio');
(async () => {
  const browser = await remote({
    capabilities: { browserName: 'chrome'
    } });
  await browser.url('https://webdriver.io'); const title = await browser.getTitle();
  console.log('Title was: ' + title); await browser.deleteSession();
})().catch((e) => console.error(e));


/*
const {expect, assert} = require('chai');
const { remote } = require('webdriverio');

(async () => {
  const browser = await remote({
    logLevel: 'trace',
    capabilities: {
      browserName: 'chrome'
    }
  })

  await browser.url('https://duckduckgo.com')

  const duckTitle = await browser.getTitle();
  console.log("THE TITLE IS ", duckTitle) // outputs: "Title is: WebdriverIO (Software) at DuckDuckGo"

  const inputElem = await browser.$('#search_form_input_homepage')
  await inputElem.setValue('WebdriverIO')

  const submitBtn = await browser.$('#search_button_homepage')
  await submitBtn.click()


  //await browser.deleteSession()
})().catch((e) => console.error(e))


describe('root test', () => {

  it('should run shell tests', () => {

    return true;

  });

});
*/
