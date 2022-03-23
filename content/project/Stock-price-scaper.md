---
title: "Stock Price Scraper"
date: 2017-08-30
description: Pandas based series on web scraping for financial data
draft: false
---

# Understanding Pandas in Python:
This was one of my first projects in python to understand data frames. Anyone interested in 
data analysis with Python needs to understand how to use, manipulate, and structure data in 
ways that are useful and required for your analysis. Thankfully, there are some _incredibly_ 
smart developers in this world that understand the importance of this task, so they developed
the [__Pandas__](https://pandas.pydata.org) package. On top of that, we can use the ever useful [__BeautifulSoup__](https://www.crummy.com/software/BeautifulSoup/bs4/doc/) 
package, which allows us to make automated scripts to interact with HTML backed webpages.

The way Beautiful soup works is by making an HTML request to a specific web page, and 
given the structure of the webpage, we can specify places where we want to _scrape_ information.

First off, here are the dependencies: 

```python 
import bs4 as bs
import datetime as dt
import os
import pandas as pd
import pandas_datareader.data as web
from pandas_datareader._utils import RemoteDataError
import pickle
import requests
```

This function below does just that: Obviously, we could write out a long list that contains all
of the ticker symbols for the S&P 500. But, there is probably structured data on some website
(*cough* Wikipedia *cough*) that we can use for the heavy lifting. 

```python

#Scrapes wikipedia S&P 500 ticker table to create object
def save_sp500_tickers():
    resp = requests.get("https://en.wikipedia.org/wiki/List_of_S%26P_500_companies")
    soup = bs.BeautifulSoup(resp.text, "html.parser")
    table = soup.find('table', {'class':'wikitable sortable'})
    tickers = []

    for row in table.find_all('tr')[1:]:
        ticker = row.find_all('td')[0].text
        tickers.append(ticker)

    with open('sp500_tickers.pickle', 'wb') as f:
        pickle.dump(tickers, f)

```

This gives us a great list for all 500 ticker symbols. If you aren't familiar with Pickles 
in Python, they are essentially a write-able file that can store data in a more compressed 
manner than, say, a csv file. More info on them can be found [here](https://ianlondon.github.io/blog/pickling-basics/)

Now for the fun stuff, we need to actually pull the pricing info for given period of time. 
We will first pickle in our ticker list, then actually use the yahoo finance port via the 
pandas data reader library to pull real time pricing information for us. This package was 
maintained back when I began this project, but I believe it's been discontinued. 
What can still be used is the [data reader](https://pandas-datareader.readthedocs.io/en/latest/) package associated with pandas. 

```python 

#Gathering all ADJ close data from Yahoo API for tickers created
#and storing in stock_data directory
def get_data_from_yahoo(reload_sp500=False):
    if reload_sp500:
        tickers = save_sp500_tickers()
    else:
        with open("sp500_tickers.pickle", "rb") as f:
            tickers = pickle.load(f)

    if not os.path.exists("stock_data"):
        os.makedirs("stock_data")


    start = dt.datetime(2000,1,1)
    end = dt.datetime(2016,12,31)

    for ticker in tickers:
        try:
            if not os.path.exists("stock_data/{}".format(ticker)):
                df = web.DataReader(ticker, 'yahoo', start, end)
                df.to_csv("stock_data/{}".format(ticker))
                print("Gathered data on {}".format(ticker))
            else:
                print("Already have data for {}".format(ticker))

        except RemoteDataError:
            print("Data Error")
            continue
            
get_data_from_yahoo()

```

The main for loop here is the money maker. We're going to iteratively step through each 
ticker, and using the pandas data reader, specify to pull the high price, low price, and 
volume for the specified date range on a daily basis. For each of these, we're going to pop
this data out into a simple CSV file according to the ticker's name. Throw in some
additional try/except catches and this process could easily work for pulling stock price information. 

### What did we learn: 
While this was one of my first projects, and hindsight is 20/20, this started a rather deep and 
continued dive into thinking about problems from a data perspective. While I learned about data 
abstraction in my later computer science courses and am still learning about how to properly store 
this data, thinking this way provides a simple heuristic to solve problems: 

> Any problem can typically be solved with information, and information exists as data somewhere. 


