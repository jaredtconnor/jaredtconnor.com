---
title: "Reddit Archiver"
date: 2022-03-18T04:40:21-07:00
description: Python and Flask based CRUD application deployed with AWS RDS
tags:
  - python
  - data
draft: false
---

[Github](https://github.com/jaredtconnor/Reddit-Archiver) | [Demo](https://reddit-archiver.herokuapp.com/)

This was basic a [CRUD](https://developer.mozilla.org/en-US/docs/Glossary/CRUD) application built with Python and [Flask](https://flask.palletsprojects.com/en/2.0.x/) we created in my [Intro to Databases](https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=340&termcode=all) course. It was a partner project and I actually got to work with [lindsaygoins](https://github.com/lindsaygoins) quite a bit! 

![Subreddits](/images/project_images/reddit_archiver/subreddits.png)

# Overview: 
The actual implemenetation of the app wasn't too complex, utilizing Bootstrap 5 and a form get/post pattern to update values. The main goal of the project wasn't actually to create a really fancy application. Rather it was mostly to solidify the basic data schema concepts and the correct relationships. 

Funny enough, our initial idea for the project was to archive [Reddit](https://www.reddit.com/) subreddits, posts, comments, and users, almost a re-designed Reddit page driven by some scraping/API service and scheduled via a cron job running on a cloud Linux VM. 

Fortunately and unfortunately, we were instructed to focus more on the data schema, defining the correct relationships, a [ERD diagram](https://www.lucidchart.com/pages/er-diagrams), and allowing users to update/add data as needed. The result is a bit less flattering of a project in terms of use cases, ultimately being a data entry and review showcase via HTML responses, but it was a fun project to work on. 

The project was a great introduction to cloud based data services as well. We initially developed on a local instance of a [Maria DB](https://mariadb.org/). This required making a Python based wrapper to the execution of SQL commands, defined within the [`db_connection.py`](https://github.com/jaredtconnor/Reddit-Archiver/blob/master/db_connection.py) module. Hindsight, though we were instructed specifically _not_ to, I would recommend the use a ORM, such as [SQLAlchemy](https://www.sqlalchemy.org/). This would likely be safer because it is a bit dangerous to be writing explicit SQL statements without proper measures to prevent against malisouc injections. 

To move things to a cloud based solution, we migrated everything up to a [AWS RDS MySql](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.MySQL.html) instance and defined the authetnication within environment variables.

![Posts Form](/images/project_images/reddit_archiver/post_form.png)

# Learning Outcomes:

 1. Co-working on a project is a ton of fun: Working with my parter on this project was really enjoyable and a great lesson in how to properly version control and push/pull changes to a remote repository.

 2. Managing cloud based data services: This project provided a great introduction to using AWS/cloud based services to develop applications. Albiet the implemenetation was constrained by the project requirements but utilizing and setting up a database in the cloud is a great skill to have. I use [DBeaver](https://dbeaver.io/) quite a bit for work, and this worked great to connect the running instance and upload/download the DDL files, edit data, and verify changes.

![Schema](/images/project_images/reddit_archiver/schema.png)

![ERD Diagram](/images/project_images/reddit_archiver/erd.png)








