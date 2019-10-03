let ouputData = {

}
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

  switch (message.type) {
    case "analyze_page":
      extractData();
      break;

    default:
      break;
  }
});

function extractData() {
  ouputData = {};
  const IframesList = document.querySelectorAll('iframe');
  IframesList.forEach((iframeElement) => {
    const iframeSrc = iframeElement.getAttribute('src')
    if (iframeSrc) {
      let pageName = iframeElement.getAttribute('src').split('/');
      pageName = pageName[pageName.length - 1].split('.')[0];
      ouputData[pageName] = {
        allCaps: [],
        altMissing: [],
        imageAsLinkMissingTitle: [],
        repeatedAlt: [],
        linkTitlesMissing: []
      }
      const getAllContents = iframeElement.contentDocument.querySelectorAll('p,span');
      const getAllImages = iframeElement.contentDocument.querySelectorAll('img');
      const getAllLinks = iframeElement.contentDocument.querySelectorAll('a');
      checkContentCaps(getAllContents, pageName);
      imageAltAndLinkCheck(getAllImages, pageName);
      linkCheck(getAllLinks, pageName);
    }
  });
  // generateReport();
  console.table(ouputData);

}

function checkContentCaps(allContents, pageName) {
  allContents.forEach((textElement) => {
    const outerText = textElement.outerText
    if (isUpperCase(outerText)) {
      ouputData[pageName].allCaps.push({
        outerText,
        textElement
      })
    }
  })
}

function imageAltAndLinkCheck(allImages, pageName) {
  allImages.forEach((imageElement) => {
    let alt = imageElement.getAttribute('alt');
    alt = alt ? alt.trim() : alt;
    let title = imageElement.getAttribute('title');
    title = title ? title.trim() : title;
    const parentElement = imageElement.parentElement
    if (alt === ""||alt===null) {
      ouputData[pageName].altMissing.push({
        alt,
        imageElement
      })
    }
    if (alt !== null && alt !== "" && alt === title) {
      ouputData[pageName].repeatedAlt.push({
        alt,
        imageElement
      })
    }
    if (parentElement.tagName === 'a') {
      ouputData[pageName].imageAsLinkMissingTitle.push({
        parentElement,
        imageElement,
        LinkDescription: parentElement.getAttribute('title')
      })
    }
  })
}

function linkCheck(allLinks, pageName) {
  allLinks.forEach((linkElement) => {
    const href = linkElement.getAttribute('href')
    if (!linkElement.querySelector('img') && !href.includes('data/glossary/') && !linkElement.getAttribute('title')) {
      ouputData[pageName].linkTitlesMissing.push({
        linkElement,
        href
      })
    }
  })

}

function generateReport() {
  Object.keys(ouputData).forEach((pageName) => {

  })
}

function isUpperCase(pageContent) {
  let convertedContent = pageContent.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\r?\n|\r/g,'')
  if (convertedContent !== '' && isNaN(Number(convertedContent)) && convertedContent !== '.' && convertedContent.trim().length > 1&&convertedContent!=="1. 2. 3."&&!/^[A-Z]{1,}\.{1,}$/gm.test(convertedContent.trim())) {
    return /^[A-Z\s0-9\.]*$/.test(convertedContent)
  }
  return false
}