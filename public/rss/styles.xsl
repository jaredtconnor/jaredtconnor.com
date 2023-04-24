zsh:1: command not found: important}.pt-xl-0{padw
</head>
<body class="bg-white">
  <nav class="container-md px-3 py-2 mt-2 mt-md-5 mb-5 markdown-body">
    <p class="bg-yellow-light ml-n1 px-1 py-1 mb-1">
      <strong>This is a web feed,</strong> also known as an RSS feed. <strong>Subscribe</strong> by
      copying the URL from the address bar into your newsreader. </p>
    <p class="text-gray"> Visit <a href="https://aboutfeeds.com">About Feeds</a> to get started with
      newsreaders and subscribing. It’s free. </p>
  </nav>
  <div class="container-md px-3 py-3 markdown-body">
    <header class="py-5">
      <h1 class="border-0">
        <!-- https://commons.wikimedia.org/wiki/File:Feed-icon.svg -->
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
          style="vertical-align: text-bottom; width: 1.2em; height: 1.2em;" class="pr-1"
          id="RSSicon" viewBox="0 0 256 256">
          <defs>
            <linearGradient x1="0.085" y1="0.085" x2="0.915" y2="0.915" id="RSSg">
              <stop offset="0.0" stop-color="#E3702D" />
              <stop offset="0.1071" stop-color="#EA7D31" />
              <stop offset="0.3503" stop-color="#F69537" />
              <stop offset="0.5" stop-color="#FB9E3A" />
              <stop offset="0.7016" stop-color="#EA7C31" />
              <stop offset="0.8866" stop-color="#DE642B" />
              <stop offset="1.0" stop-color="#D95B29" />
            </linearGradient>
          </defs>
          <rect width="256" height="256" rx="55" ry="55" x="0" y="0" fill="#CC5D15" />
          <rect width="246" height="246" rx="50" ry="50" x="5" y="5" fill="#F49C52" />
          <rect width="236" height="236" rx="47" ry="47" x="10" y="10" fill="url(#RSSg)" />
          <circle cx="68" cy="189" r="24" fill="#FFF" />
          <path d="M160 213h-34a82 82 0 0 0 -82 -82v-34a116 116 0 0 1 116 116z" fill="#FFF" />
          <path d="M184 213A140 140 0 0 0 44 73 V 38a175 175 0 0 1 175 175z" fill="#FFF" />
        </svg>
        Web Feed Preview </h1>
      <h2>
        <xsl:value-of select="/rss/channel/title" />
      </h2>
      <p>
        <xsl:value-of select="/rss/channel/description" />
      </p>
      <a class="head_link" target="_blank">
        <xsl:attribute name="href">
          <xsl:value-of select="/rss/channel/link" />
        </xsl:attribute> Visit Website &#x2192; </a>
    </header>
    <h2>Recent Items</h2>
    <xsl:for-each select="/rss/channel/item">
      <div class="pb-5">
        <h3 class="mb-0">
          <a target="_blank">
            <xsl:attribute name="href">
              <xsl:value-of select="link" />
            </xsl:attribute>
            <xsl:value-of select="title" />
          </a>
        </h3>
        <small class="text-gray"> Published: <xsl:value-of select="pubDate" />
        </small>
      </div>
    </xsl:for-each>
  </div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
<!--

# Pretty Feed

Styles an RSS/Atom feed, making it friendly for humans viewers, and adds a link
to aboutfeeds.com for new user onboarding. See it in action:

   https://interconnected.org/home/feed


## How to use

1. Download this XML stylesheet from the following URL and host it on your own
   domain (this is a limitation of XSL in browsers):

   https://github.com/genmon/aboutfeeds/blob/main/tools/pretty-feed-v3.xsl

2. Include the XSL at the top of the RSS/Atom feed, like:

```
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="/PATH-TO-YOUR-STYLES/pretty-feed-v3.xsl" type="text/xsl"?>
```

3. Serve the feed with the following HTTP headers:

```
Content-Type: application/xml; charset=utf-8  # not application/rss+xml
x-content-type-options: nosniff
```

(These headers are required to style feeds for users with Safari on iOS/Mac.)



## Limitations

- Styling the feed *prevents* the browser from automatically opening a
  newsreader application. This is a trade off, but it's a benefit to new users
  who won't have a newsreader installed, and they are saved from seeing or
  downloaded obscure XML content. For existing newsreader users, they will know
  to copy-and-paste the feed URL, and they get the benefit of an in-browser feed
  preview.
- Feed styling, for all browsers, is only available to site owners who control
  their own platform. The need to add both XML and HTTP headers makes this a
  limited solution.


## Credits

pretty-feed is based on work by lepture.com:

   https://lepture.com/en/2019/rss-style-with-xsl

This current version is maintained by aboutfeeds.com:

   https://github.com/genmon/aboutfeeds


## Feedback

This file is in BETA. Please test and contribute to the discussion:

     https://github.com/genmon/aboutfeeds/issues/8

-->
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
<xsl:template match="/">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>-right:40px!important}.pb-xl-6{padding-bottom:40px!important}.pl-xl-6{padding-left:40px!important}.px-xl-6{padding-right:40px!important;padding-left:40px!important}.py-xl-6{padding-top:40px!important;padding-bottom:40px!important}}.p-responsive{padding-right:16px!important;padding-left:16px!important}@media
(min-width:544px){.p-responsive{padding-right:40px!important;padding-left:40px!important}}@media
(min-width:1012px){.p-responsive{padding-right:16px!important;padding-left:16px!important}}.h1{font-size:26px!important}@media
(min-width:768px){.h1{font-size:32px!important}}.h2{font-size:22px!important}@media
(min-width:768px){.h2{font-size:24px!important}}.h3{font-size:18px!important}@media
(min-width:768px){.h3{font-size:20px!important}}.h4{font-size:16px!important}.h5{font-size:14px!important}.h6{font-size:12px!important}.h1,.h2,.h3,.h4,.h5,.h6{font-weight:600!important}.f1{font-size:26px!important}@media
(min-width:768px){.f1{font-size:32px!important}}.f2{font-size:22px!important}@media
(min-width:768px){.f2{font-size:24px!important}}.f3{font-size:18px!important}@media
(min-width:768px){.f3{font-size:20px!important}}.f4{font-size:16px!important}@media
(min-width:768px){.f4{font-size:16px!important}}.f5{font-size:14px!important}.f6{font-size:12px!important}.f00-light{font-size:40px!important;font-weight:300!important}@media
(min-width:768px){.f00-light{font-size:48px!important}}.f0-light{font-size:32px!important;font-weight:300!important}@media
(min-width:768px){.f0-light{font-size:40px!important}}.f1-light{font-size:26px!important;font-weight:300!important}@media
(min-width:768px){.f1-light{font-size:32px!important}}.f2-light{font-size:22px!important;font-weight:300!important}@media
(min-width:768px){.f2-light{font-size:24px!important}}.f3-light{font-size:18px!important;font-weight:300!important}@media
(min-width:768px){.f3-light{font-size:20px!important}}.text-small{font-size:12px!important}.lead{margin-bottom:30px;font-size:20px;font-weight:300;color:#586069}.lh-condensed-ultra{line-height:1!important}.lh-condensed{line-height:1.25!important}.lh-default{line-height:1.5!important}.lh-0{line-height:0!important}.text-right{text-align:right!important}.text-left{text-align:left!important}.text-center{text-align:center!important}@media
(min-width:544px){.text-sm-right{text-align:right!important}.text-sm-left{text-align:left!important}.text-sm-center{text-align:center!important}}@media
(min-width:768px){.text-md-right{text-align:right!important}.text-md-left{text-align:left!important}.text-md-center{text-align:center!important}}@media
(min-width:1012px){.text-lg-right{text-align:right!important}.text-lg-left{text-align:left!important}.text-lg-center{text-align:center!important}}@media
(min-width:1280px){.text-xl-right{text-align:right!important}.text-xl-left{text-align:left!important}.text-xl-center{text-align:center!important}}.text-normal{font-weight:400!important}.text-bold{font-weight:600!important}.text-italic{font-style:italic!important}.text-uppercase{text-transform:uppercase!important}.text-underline{text-decoration:underline!important}.no-underline{text-decoration:none!important}.no-wrap{white-space:nowrap!important}.ws-normal{white-space:normal!important}.wb-break-all{word-break:break-all!important}.text-emphasized{font-weight:600;color:#24292e}.list-style-none{list-style:none!important}.text-shadow-dark{text-shadow:0
1px 1px rgba(27,31,35,.25),0 1px 25px rgba(27,31,35,.75)}.text-shadow-light{text-shadow:0 1px 0
rgba(255,255,255,.5)}.text-mono{font-family:SFMono-Regular,Consolas,"Liberation
Mono",Menlo,Courier,monospace}.user-select-none{user-select:none!important}.d-block{display:block!important}.d-flex{display:flex!important}.d-inline{display:inline!important}.d-inline-block{display:inline-block!important}.d-inline-flex{display:inline-flex!important}.d-none{display:none!important}.d-table{display:table!important}.d-table-cell{display:table-cell!important}@media
(min-width:544px){.d-sm-block{display:block!important}.d-sm-flex{di
<title><xsl:value-of select="/rss/channel/title" /> Web Feed</title>t}.pl-xl-5{padding-left:32px!important}.px-xl-5{padding-right:32px!important;padding-left:32px!important}.py-xl-5{padding-top:32px!important;padding-bottom:32px!important}.p-xl-6{padding:40px!important}.pt-xl-6{padding-top:40px!important}.pr-xl-6{paddingsplay:flex!important}.d-sm-inline{display:inline!important}.d-sm-inline-block{display:inline-block!important}.d-sm-inline-flex{display:inline-flex!important}.d-sm-none{display:none!important}.d-sm-table{display:table!important}.d-sm-table-cell{display:table-cell!important}}@media
(min-width:768px){.d-md-block{display:block!important}.d-md-flex{display:flex!important}.d-md-inline{display:inline!important}.d-md-inline-block{display:inline-block!important}.d-md-inline-flex{display:inline-flex!important}.d-md-none{display:none!important}.d-md-table{display:table!important}.d-md-table-cell{display:table-cell!important}}@media
(min-width:1012px){.d-lg-block{display:block!important}.d-lg-flex{display:flex!important}.d-lg-inline{display:inline!important}.d-lg-inline-block{display:inline-block!important}.d-lg-inline-flex{display:inline-flex!important}.d-lg-none{display:none!important}.d-lg-table{display:table!important}.d-lg-table-cell{display:table-cell!important}}@media
(min-width:1280px){.d-xl-block{display:block!important}.d-xl-flex{display:flex!important}.d-xl-inline{display:inline!important}.d-xl-inline-block{display:inline-block!important}.d-xl-inline-flex{display:inline-flex!important}.d-xl-none{display:none!important}.d-xl-table{display:table!important}.d-xl-table-cell{display:table-cell!important}}.v-hidden{visibility:hidden!important}.v-visible{visibility:visible!important}@media
(max-width:544px){.hide-sm{display:none!important}}@media (min-width:544px)
and(max-width:768px){.hide-md{display:none!important}}@media (min-width:768px)
and(max-width:1012px){.hide-lg{display:none!important}}@media
(min-width:1012px){.hide-xl{display:none!important}}.table-fixed{table-layout:fixed!important}.sr-only{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);word-wrap:normal;border:0}.show-on-focus{position:absolute;width:1px;height:1px;margin:0;overflow:hidden;clip:rect(1px,1px,1px,1px)}.show-on-focus:focus{z-index:20;width:auto;height:auto;clip:auto}.container{width:980px;margin-right:auto;margin-left:auto}.container::before{display:table;content:""}.container::after{display:table;clear:both;content:""}.container-md{max-width:768px;margin-right:auto;margin-left:auto}.container-lg{max-width:1012px;margin-right:auto;margin-left:auto}.container-xl{max-width:1280px;margin-right:auto;margin-left:auto}.columns{margin-right:-10px;margin-left:-10px}.columns::before{display:table;content:""}.columns::after{display:table;clear:both;content:""}.column{float:left;padding-right:10px;padding-left:10px}.one-third{width:33.333333%}.two-thirds{width:66.666667%}.one-fourth{width:25%}.one-half{width:50%}.three-fourths{width:75%}.one-fifth{width:20%}.four-fifths{width:80%}.centered{display:block;float:none;margin-right:auto;margin-left:auto}.col-1{width:8.3333333333%}.col-2{width:16.6666666667%}.col-3{width:25%}.col-4{width:33.3333333333%}.col-5{width:41.6666666667%}.col-6{width:50%}.col-7{width:58.3333333333%}.col-8{width:66.6666666667%}.col-9{width:75%}.col-10{width:83.3333333333%}.col-11{width:91.6666666667%}.col-12{width:100%}@media
(min-width:544px){.col-sm-1{width:8.3333333333%}.col-sm-2{width:16.6666666667%}.col-sm-3{width:25%}.col-sm-4{width:33.3333333333%}.col-sm-5{width:41.6666666667%}.col-sm-6{width:50%}.col-sm-7{width:58.3333333333%}.col-sm-8{width:66.6666666667%}.col-sm-9{width:75%}.col-sm-10{width:83.3333333333%}.col-sm-11{width:91.6666666667%}.col-sm-12{width:100%}}@media
(min-width:768px){.col-md-1{width:8.3333333333%}.col-md-2{width:16.6666666667%}.col-md-3{width:25%}.col-md-4{width:33.3333333333%}.col-md-5{width:41.6666666667%}.col-md-6{width:50%}.col-md-7{width:58.3333333333%}.col-md-8{width:66.6666666667%}.col-md-9{width:75%}.col-md-10{width:83.3333333333%}.col-md-11{width:91.6666666667%}.col-md-12{width:100%}}@media
(min-width:1012px){.col-lg-1{width:8.3333333333%}.co
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />l-lg-2{width:16.6666666667%}.col-lg-3{width:25%}.col-lg-4{width:33.3333333333%}.col-lg-5{width:41.6666666667%}.col-lg-6{width:50%}.col-lg-7{width:58.3333333333%}.col-lg-8{width:66.6666666667%}.col-lg-9{width:75%}.col-lg-10{width:83.3333333333%}.col-lg-11{width:91.6666666667%}.col-lg-12{width:100%}}@media
(min-width:1280px){.col-xl-1{width:8.3333333333%}.col-xl-2{width:16.6666666667%}.col-xl-3{width:25%}.col-xl-4{width:33.3333333333%}.col-xl-5{width:41.6666666667%}.col-xl-6{width:50%}.col-xl-7{width:58.3333333333%}.col-xl-8{width:66.6666666667%}.col-xl-9{width:75%}.col-xl-10{width:83.3333333333%}.col-xl-11{width:91.6666666667%}.col-xl-12{width:100%}}.gutter{margin-right:-16px;margin-left:-16px}.gutter>[class*=col-]{padding-right:16px!important;padding-left:16px!important}.gutter-condensed{margin-right:-8px;margin-left:-8px}.gutter-condensed>[class*=col-]{padding-right:8px!important;padding-left:8px!important}.gutter-spacious{margin-right:-24px;margin-left:-24px}.gutter-spacious>[class*=col-]{padding-right:24px!important;padding-left:24px!important}@media
(min-width:544px){.gutter-sm{margin-right:-16px;margin-left:-16px}.gutter-sm>[class*=col-]{padding-right:16px!important;padding-left:16px!important}.gutter-sm-condensed{margin-right:-8px;margin-left:-8px}.gutter-sm-condensed>[class*=col-]{padding-right:8px!important;padding-left:8px!important}.gutter-sm-spacious{margin-right:-24px;margin-left:-24px}.gutter-sm-spacious>[class*=col-]{padding-right:24px!important;padding-left:24px!important}}@media
(min-width:768px){.gutter-md{margin-right:-16px;margin-left:-16px}.gutter-md>[class*=col-]{padding-right:16px!important;padding-left:16px!important}.gutter-md-condensed{margin-right:-8px;margin-left:-8px}.gutter-md-condensed>[class*=col-]{padding-right:8px!important;padding-left:8px!important}.gutter-md-spacious{margin-right:-24px;margin-left:-24px}.gutter-md-spacious>[class*=col-]{padding-right:24px!important;padding-left:24px!important}}@media
(min-width:1012px){.gutter-lg{margin-right:-16px;margin-left:-16px}.gutter-lg>[class*=col-]{padding-right:16px!important;padding-left:16px!important}.gutter-lg-condensed{margin-right:-8px;margin-left:-8px}.gutter-lg-condensed>[class*=col-]{padding-right:8px!important;padding-left:8px!important}.gutter-lg-spacious{margin-right:-24px;margin
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />-left:-24px}.gutter-lg-spacious>[class*=col-]{padding-right:24px!important;padding-left:24px!important}}@media
(min-width:1280px){.gutter-xl{margin-right:-16px;margin-left:-16px}.gutter-xl>[class*=col-]{padding-right:16px!important;padding-left:16px!important}.gutter-xl-condensed{margin-right:-8px;margin-left:-8px}.gutter-xl-condensed>[class*=col-]{padding-right:8px!important;padding-left:8px!important}.gutter-xl-spacious{margin-right:-24px;margin-left:-24px}.gutter-xl-spacious>[class*=col-]{padding-right:24px!important;padding-left:24px!important}}.offset-1{margin-left:8.3333333333%!important}.offset-2{margin-left:16.6666666667%!important}.offset-3{margin-left:25%!important}.offset-4{margin-left:33.3333333333%!important}.offset-5{margin-left:41.6666666667%!important}.offset-6{margin-left:50%!important}.offset-7{margin-left:58.3333333333%!important}.offset-8{margin-left:66.6666666667%!important}.offset-9{margin-left:75%!important}.offset-10{margin-left:83.3333333333%!important}.offset-11{margin-left:91.6666666667%!important}@media
(min-width:544px){.offset-sm-1{margin-left:8.3333333333%!important}.offset-sm-2{margin-left:16.6666666667%!important}.offset-sm-3{margin-left:25%!important}.offset-sm-4{margin-left:33.3333333333%!important}.offset-sm-5{margin-left:41.6666666667%!important}.offset-sm-6{margin-left:50%!important}.offset-sm-7{margin-left:58.3333333333%!important}.offset-sm-8{margin-left:66.6666666667%!important}.offset-sm-9{margin-left:75%!important}.offset-sm-10{margin-left:83.3333333333%!important}.offset-sm-11{margin-left:91.6666666667%!important}}@media
(min-width:768px){.offset-md-1{margin-left:8.3333333333%!important}.offset-md-2{margin-left:16.6666666667%!important}.offset-md-3{margin-left:25%!important}.offset-md-4{margin-left:33.3333333333%!important}.offset-md-5{margin-left:41.6666666667%!important}.offset-md-6{margin-left:50%!important}.offset-md-7{margin-left:58.3333333333%!important}.offset-md-8{margin-left:66.6666666667%!important}.offset-md-9{margin-left:75%!important}.offset-md-10{margin-left:83.3333333333%!important}.offset-md-11{margin-left:91.6666666667%!important}}@media
(min-width:1012px){.offset-lg-1{margin-left:8.3333333333%!important}.offset-lg-2{margin-left:16.6666666667%!important}.offset-lg-3{margin-left:25%!important}.offset-lg-4{margin-left:33.3333333333%!important}.offset-lg-5{margin-left:41.6666666667%!important}.offset-lg-6{margin-left:50%!important}.offset-lg-7{margin-left:58.3333333333%!important}.offset-lg-8{margin-left:66.6666666667%!important}.offset-lg-9{margin-left:75%!important}.offset-lg-10{margin-left:83.3333333333%!important}.offset-lg-11{margin-left:91.6666666667%!important}}@media
(min-width:1280px){.offset-xl-1{margin-left:8.3333333333%!important}.offset-xl-2{margin-left:16.6666666667%!important}.offset-xl-3{margin-left:25%!important}.offset-xl-4{margin-left:33.3333333333%!important}.offset-xl-5{margin-left:41.6666666667%!important}.offset-xl-6{margin-left:50%!important}.offset-xl-7{margin-left:58.3333333333%!important}.offset-xl-8{margin-left:66.6666666667%!important}.offset-xl-9{margin-left:75%!important}.offset-xl-10{margin-left:83.3333333333%!important}.offset-xl-11{margin-left:91.6666666667%!important}}.markdown-body{font-family:-apple-system,BlinkMacSystemFont,"Segoe
UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI
Symbol";font-size:16px;line-height:1.5;word-wrap:break-word}.markdown-body::before{display:table;content:""}.markdown-body::after{display:table;clear:both;content:""}.markdown-body>*
:first-child{margin-top:0!important}.markdown-body>*
:last-child{margin-bottom:0!important}.markdown-body
a:not([href]){color:inherit;text-decoration:none}.markdown-body .absent{color:#cb2431}.markdown-body
.anchor{float:left;padding-right:4px;margin-left:-20px;line-height:1}.markdown-body
.anchor:focus{outline:0}.markdown-body blockquote,.markdown-body dl,.markdown-body ol,.markdown-body
p,.markdown-body pre,.markdown-body table,.markdown-body
ul{margin-top:0;margin-bottom:16px}.markdown-body hr{height:.25em;padding:0;margin:24px
0;background-color:#e1e4e8;border:0}.markdown-body blockquote{padding:0
1em;color:#6a737d;border-left:.25em solid #dfe2e5}.markdown-body
blockquote>:first-child{margin-top:0}.markdown-body
blockquote>:last-child{margin-bottom:0}.markdown-body kbd{display:inline-block;padding:3px
5px;font-size:11px;line-height:10px;color:#444d56;vertical-align:middle;background-color:#fafbfc;border:solid
1px #c6cbd1;border-bottom-color:#959da5;border-radius:3px;box-shadow:inset 0 -1px 0
#959da5}.markdown-body h1,.markdown-body h2,.markdown-
h2{padding-bottom:.3em;font-size:1.5em;border-bottom:1px solid #eaecef}.markdown-body
h3{font-size:1.25em}.markdown-body h4{font-size:1em}.markdown-body
h5{font-size:.875em}.markdown-body h6{font-size:.85em;color:#6a737d}.markdown-body ol,.markdown-body
ul{padding-left:2em}.markdown-body ol.no-list,.markdown-body
ul.no-list{padding:0;list-style-type:none}.markdown-body ol ol,.markdown-body ol ul,.markdown-body
ul ol,.markdown-body ul ul{margin-top:0;margin-bottom:0}.markdown-body
li{word-wrap:break-all}.markdown-body li>p{margin-top:16px}.markdown-body
li+li{margin-top:.25em}.markdown-body dl{padding:0}.markdown-body dl
dt{padding:0;margin-top:16px;font-size:1em;font-style:italic;font-weight:600}.markdown-body dl
dd{padding:0 16px;margin-bottom:16px}.markdown-body
table{display:block;width:100%;overflow:auto}.markdown-body table th{font-weight:600}.markdown-body
table td,.markdown-body table th{padding:6px 13px;border:1px solid #dfe2e5}.markdown-body table
tr{background-color:#fff;border-top:1px solid #c6cbd1}.markdown-body table
tr:nth-child(2n){background-color:#f6f8fa}.markdown-body table
img{background-color:transparent}.markdown-body
img{max-width:100%;box-sizing:content-box;background-color:#fff}.markdown-body
img[align=right]{padding-left:20px}.markdown-body img[align=left]{padding-right:20px}.markdown-body
.emoji{max-width:none;vertical-align:text-top;background-color:transparent}.markdown-body
span.frame{display:block;overflow:hidden}.markdown-body
span.frame>span{display:block;float:left;width:auto;padding:7px;margin:13px 0
0;overflow:hidden;border:1px solid #dfe2e5}.markdown-body span.frame span
img{display:block;float:left}.markdown-body span.frame span span{display:block;padding:5px 0
0;clear:both;color:#24292e}.markdown-body
span.align-center{display:block;overflow:hidden;clear:both}.markdown-body
span.align-center>span{display:block;margin:13px auto
0;overflow:hidden;text-align:center}.markdown-body span.align-center span img{margin:0
auto;text-align:center}.markdown-body
span.align-right{display:block;overflow:hidden;clear:both}.markdown-body
span.align-right>span{display:block;margin:13px 0 0;overflow:hidden;text-align:right}.markdown-body
span.align-right span img{margin:0;text-align:right}.markdown-body
span.float-left{display:block;float:left;margin-right:13px;overflow:hidden}.markdown-body
span.float-left span{margin:13px 0 0}.markdown-body
span.float-right{display:block;float:right;margin-left:13px;overflow:hidden}.markdown-body
span.float-right>span{display:block;margin:13px auto
0;overflow:hidden;text-align:right}.markdown-body code,.markdown-body tt{padding:.2em
.4em;margin:0;font-size:85%;background-color:rgba(27,31,35,.05);border-radius:3px}.markdown-body
code br,.markdown-body tt br{display:none}.markdown-body del
code{text-decoration:inherit}.markdown-body pre{word-wrap:normal}.markdown-body
pre>code{padding:0;margin:0;font-size:100%;word-break:normal;white-space:pre;background:0
0;border:0}.markdown-body .highlight{margin-bottom:16px}.markdown-body .highlight
pre{margin-bottom:0;word-break:normal}.markdown-body .highlight pre,.markdown-body
pre{padding:16px;overflow:auto;font-size:85%;line-height:1.45;background-color:#f6f8fa;border-radius:3px}.
<?xml version="1.0" encoding="utf-8"?>nt}.pr-xl-3{padding-right:16px!important}.pb-xl-3{padding-bottom:16px!important}.pl-xl-3{padding-left:16px!important}.px-xl-3{padding-right:16px!important;padding-left:16px!important}.py-xl-3{padding-top:16px!important;padding-bottom:16px!important}.p-xl-4{padding:24px!important}.pt-xl-4{padding-top:24px!important}.pr-xl-4{padding-right:24px!important}.pb-xl-4{padding-bottom:24px!important}.pl-xl-4{padding-left:24px!important}.px-xl-4{padding-right:24px!important;padding-left:24px!important}.py-xl-4{padding-top:24px!important;padding-bottom:24px!important}.p-xl-5{padding:32px!important}.pt-xl-5{padding-top:32px!important}.pr-xl-5{padding-right:32px!important}.pb-xl-5{padding-bottom:32px!importan
<!--

# Pretty Feed

Styles an RSS/Atom feed, making it friendly for humans viewers, and adds a linkding-top:0!important}.pr-xl-0{padding-right:0!important}.pb-xl-0{padding-bottom:0!important}.pl-xl-0{padding-left:0!important}.px-xl-0{padding-right:0!important;padding-left:0!important}.py-xl-0{padding-top:0!important;padding-bottom:0!important}.p-xl-1{padding:4px!important}.pt-xl-1{padding-top:4px!important}.pr-xl-1{padding-right:4px!important}.pb-xl-1{padding-bottom:4px!important}.pl-xl-1{padding-left:4px!important}.px-xl-1{padding-right:4px!important;padding-left:4px!important}.py-xl-1{padding-top:4px!important;padding-bottom:4px!important}.p-xl-2{padding:8px!important}.pt-xl-2{padding-top:8px!important}.pr-xl-2{padding-right:8px!important}.pb-xl-2{padding-bottom:8px!important}.pl-xl-2{padding-left:8px!important}.px-xl-2{padding-right:8px!important;padding-left:8px!important}.py-xl-2{padding-top:8px!important;padding-bottom:8px!important}.p-xl-3{padding:16px!important}.pt-xl-3{padding-top:16px!importa
to aboutfeeds.com for new user onboarding. See it in action:

   https://interconnected.org/home/feed

g-top:24px!important;padding-bottom:24px!important}.p-lg-5{padding:32px!important}.pt-lg-5{padding-top:32px!important}.pr-lg-5{padding-right:32px!important}.pb-lg-5{padding-bottom:32px!important}.pl-lg-5{padding-left:32px!important}.px-lg-5{padding-right:32px!important;padding-left:32px!important}.py-lg-5{padding-top:32px!important;padding-bottom:32px!important}.p-lg-6{padding:40px!important}.pt-lg-6{padding-top:40px!important}.pr-lg-6{padding-right:40px!important}.pb-lg-6{padding-bottom:40px!important}.pl-lg-6{padding-left:40px!important}.px-lg-6{padding-right:40px!important;padding-left:40px!important}.py-lg-6{padding-top:40px!important;padding-bottom:40px!important}}@media (min-width:1280px){.p-xl-0{padding:
