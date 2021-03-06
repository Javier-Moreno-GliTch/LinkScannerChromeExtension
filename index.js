import puppeteer from 'puppeteer';

const targetPages = [
    "http://www.mangago.me/" 
  ]; 
  
  (async function main() {
    try {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
  
      
      for (let i = 0; i < targetPages.length; i++) {
        let targetPage = targetPages[i];
        await page.goto(targetPage);
  
        let styleLinks = await page.$$eval('head > link[rel="stylesheet"][href]', (linkTags) => {
          return linkTags.map((linkTag) => linkTag.href);
        });
  
        let scriptLinks = await page.$$eval("script[src]", (scriptTags) => {
          return scriptTags.map((scriptTag) => scriptTag.src);
        });
  
        let anchorLinks = await page.$$eval("a[href]", (anchorTags) => {
          return anchorTags.map((anchorTag) => anchorTag.href);
        });
        
        let imgLinks = await page.$$eval("img[src]", (imgTags) => {
          return imgTags.map((imgTag) => imgTag.src);
        });
  
        console.log(`Checking ${targetPage}`);
        logInvalidLinks(anchorLinks, "ANCHOR LINK");
        logInvalidLinks(imgLinks, "IMG LINK");
        logInvalidLinks(scriptLinks, "SCRIPT LINK");
        logInvalidLinks(styleLinks, "STYLESHEET LINK");
  
        await browser.close();
      }
    } catch (err) {
      console.log(err);
    }
  })();
  
  function logInvalidLinks(links, type) {
    let invalidLinks = [];
    let message = "";
    links.map((link) => {
      let regex = /^https:/;
      let isHTTPS = link.match(regex) ? true : false;
      let isLink = link.length > 0;
      if (!isHTTPS && isLink) {
        invalidLinks.push(link);
      }
    });
  
    if (invalidLinks.length > 0) {
      message = `Invalid ${type}s:\n`;
      invalidLinks.map(invalidLink => message += `${invalidLink}\n`);
    } else {
      message = `All ${type} are HTTPS.`;
    }
    console.log(message);
  }