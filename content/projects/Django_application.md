---
title: "Flask_apl"
repo: ""
tags: [python, web_development, djagno]
weight: 1
date: 2019-09-30T17:44:42-07:00
draft: true
---


I've been wanting to dive down and explore web applications for some time now. At work, we commonly come to situations where we rely on terrible vendor applications. While I can't discount there work, it leads me to believe that it wouldn't be incredibly hard to develop a full web application from scratch. This kind of thinking has commonly got me in trouble, so let's test it. How hard would it be to build an actual web application? 

There are a lot of assumptions that must be answered before this question. First off, I enjoy writing in Python and I want to make a full suite application, thus, I'm going to settle with writing this in (Django)[https://www.djangoproject.com]. You can go find a bunch of material regarding web application frameworks and they will provide you with a bunch of generalizations. That said, Django is a fairly well developed framework that has a _ton_ of scaleability. Just go take a look at the variety of sites that you can (build)[https://www.djangosites.org]! There are one off sites, personal sites, full applications, and even more. Additionally, this framework follows the __batteries included__ philosophy, in which a lot of the components are provided as is. 

There are other more specialized dashboard and application builders out there (i.e. (Plotly)[https://plot.ly] or (Shiny)[https://shiny.rstudio.com]), but they are very constrained with the kind of applications you can create. For this project, I'm going to attempt to understand: 

Learning goals: 

1) How to properly manage a full stack application (e.g. Client > Backend > Database)
2) How to manage security for a web application

The added benefit is I might be able to utilized this project! This tutorial comes from (Mozilla's developer tutorial base for Django)[https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django]. We are going to be creating a library site! In it, we will be able to display, log, and track books located in the library.

ß