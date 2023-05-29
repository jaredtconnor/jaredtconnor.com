---
title: "Housing Price Analysis"
tags: [python, pandas, data_analysis]
pubDate: 2018-05-22 
draft: false
---

This was one of my initial projects in python to attempt to understand the language's capabilites for data analysis. It is based on the great work done by [Harrison and Python Programming](https://pythonprogramming.net/data-analysis-python-pandas-tutorial-introduction/), and I cannot attest enough to how amazing these tutorials are. 

The project is broken up into two main sections: 

### 1) Data Gathering: 
I would argue one of the most important libraries to first understand if you are interested in diving into anlaysis must be [Pandas](https://pandas.pydata.org). There are a plethora of use cases for this library but it importantly lays the ground work for thinking about data in tabular formats. This concept really didn't stick until I read Hadley Wickhams [_Tidy Data_](https://vita.had.co.nz/papers/tidy-data.pdf) paper, which details the idea of thinking in terms of tabular data formats. 

Nonetheless, we can utilize Pandas built in html parser to query wikipedia's state list to build a subpart to a query that we will pass directly to [Quandl's](https://www.quandl.com). 

### 2) Correlation Analysis: 
First off, let's first understand the framework of analysis that we are attempting to portray. From an investor's standpoint, they are likely attempting to maximize their available return given a specific strategy. In terms of housing prices, remembering what our economics professor told us about _prices being a signal of information_, we can visualize specific market's to see if two markets are correlated.   

There is a bunch of practice in here with details on smoothing points, plotting with the [Matplotlib](https://matplotlib.org), and running built in correlation analysis. 

In the end, we lay down the central idea for a mean reversion strategy:

> If Oregon and Idaho are proven to have a fairly high historical correlation, then in theory we could devise a strategy to purchase housing in the market that is breaking away from the correlation in the hopes that the prices will eventually return to their long run average and increase in price. 

All in all, this was one of my favorite personal projects I did back when I was still learning and it's eventually sparked my interest in housing markets.

You can view the jupyter notebook [here](/files/real_estate_analysis.html)
