/*global browser BrowserManager RenderOptions ItemSorter Transfer TextTools ThemeManager*/
'use strict';

class FeedTransform { /*exported FeedTransform*/

  static async transformFeedToHtml_async(feedInfo) {
    let xmlDoc = await FeedTransform._exportFeedToXml_async(feedInfo);
    let htmlText = await FeedTransform._transform_async(xmlDoc, feedInfo.isError);
    return htmlText;
  }

  static async _exportFeedToXml_async(feedInfo, xsltUrl) {
    let feedXml = FeedTransform._getFeedXml(feedInfo, xsltUrl);
    return feedXml;
  }

  static _getFeedXml(feedInfo) {
    let iconUrl = browser.runtime.getURL(ThemeManager.instance.iconDF32Url);
    let templateCssUrl = browser.runtime.getURL(ThemeManager.instance.getRenderCssTemplateUrl(feedInfo.isError));
    let xsltUrl = browser.runtime.getURL(ThemeManager.instance.getRenderXslTemplateUrl(feedInfo.isError));
    let themeUrl = browser.runtime.getURL(ThemeManager.instance.getRenderCssUrl());

    let feedXml = '<?xml-stylesheet type="text/xsl" href= "' + xsltUrl + `" ?>
<render>
  <context>
    <icon><![CDATA[` + iconUrl + `]]></icon>
    <template><![CDATA[` + templateCssUrl + `]]></template>
    <theme><![CDATA[` + themeUrl + `]]></theme>  
  </context>
  <channel>
    <title><![CDATA[` + (feedInfo.channel.title || '(no title)') + `]]></title>
    <link><![CDATA[` + feedInfo.channel.link + `]]></link>
    <description>
      <![CDATA[` + (feedInfo.channel.description || '') + `]]>
    </description>
    </channel>
  <items>`
      + FeedTransform._getItemsXmlFragments(feedInfo) + `
  </items>
</render>`;

    return feedXml;
  }

  static _getItemsXmlFragments(feedInfo) {
    feedInfo.itemList = ItemSorter.instance.sort(feedInfo.itemList);
    let itemsXmlFragments = '';
    for (let i = 0; i < feedInfo.itemList.length; i++) {
      itemsXmlFragments += FeedTransform._getItemXmlFragments(feedInfo.itemList[i], i + 1);
    }
    return itemsXmlFragments;
  }

  static _getItemXmlFragments(item, itemNumber) {
    let itemXmlFragments = '';
    itemXmlFragments = `
    <item>
      <number><![CDATA[` + (itemNumber ? itemNumber : item.number) + `]]></number>
      <title><![CDATA[` + item.title + `]]></title>
      <target><![CDATA[` + (RenderOptions.instance.itemNewTab ? '_blank' : '') + `]]></target>
      <link><![CDATA[` + item.link + `]]></link>
      <description>
        <![CDATA[` + FeedTransform._transformEncode(item.description) + ']]>' + `
      </description>
      <category><![CDATA[` + item.category + `]]></category>
      <author><![CDATA[` + item.author + `]]></author>
      <pubDateText><![CDATA[` + item.pubDateText + `]]></pubDateText>
      <enclosures>
        <enclosure>
          <mimetype><![CDATA[` + (item.enclosure ? item.enclosure.mimetype : '') + `]]></mimetype>
          <link><![CDATA[` + (item.enclosure ? item.enclosure.url : '') + `]]></link>
        </enclosure>      
      </enclosures>
    </item>\n`;
    return itemXmlFragments;
  }

  static async _transform_async(xmlText, isError) {
    console.log('---------------------------');
    console.log('xmlText:\n', xmlText);
    let xslDocUrl = browser.runtime.getURL(ThemeManager.instance.getRenderXslTemplateUrl(isError));
    let xslStylesheet = await Transfer.downloadXlsFile_async(xslDocUrl);
    let xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xslStylesheet);
    let oParser = new DOMParser();
    let xmlDoc = oParser.parseFromString(xmlText, 'application/xml');
    let htmlDoc = xsltProcessor.transformToDocument(xmlDoc);
    FeedTransform._decodeElements(htmlDoc, 'itemDescription');
    let htmlText = htmlDoc.documentElement.outerHTML;
    console.log('---------------------------');
    console.log('htmlText:\n', htmlText);
    return htmlText;
  }

  static _decodeElements(htmlDoc, elementClass) {
    let elementList = htmlDoc.getElementsByClassName(elementClass);
    for (let element of elementList) {
      let decodedContent = FeedTransform._transformDecode(element.innerHTML);
      BrowserManager.setInnerHtmlByElement(element, decodedContent, true);
    }
  }

  static _transformEncode(decodedText) {
    let encodedText = TextTools.toTextCharCodeArray(decodedText);
    return encodedText;
  }

  static _transformDecode(encodedText) {
    let decodedText = TextTools.fromTextCharCodeArray(encodedText);
    return decodedText;
  }
}
