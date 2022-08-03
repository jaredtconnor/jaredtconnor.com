---
title: "Reddit Archiver"
date: 2021-12-26
description: Python and Flask based CRUD application deployed with AWS RDS
tags:
  - python
  - data
draft: false
---

[Github](https://github.com/jaredtconnor/Reddit-Archiver) | [Demo](https://reddit-archiver.herokuapp.com/)

This project was a basic [CRUD](https://developer.mozilla.org/en-US/docs/Glossary/CRUD) application built with Python and [Flask](https://flask.palletsprojects.com/en/2.0.x/) we created in my [Intro to Databases](https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=340&termcode=all) course. I was able to work with [lindsaygoins](https://github.com/lindsaygoins) on this, another C.S. student in the program at the time.

![Subreddits](/images/project_images/reddit_archiver/subreddits.png)

## Overview
The actual implementation of the app wasn't too complex, utilizing Bootstrap 5 and a form get/post pattern to update values. The project description was to define a correct data schema and entity-relationship model to properly allow data to flow into, from, and correctly edit within a web-based SQL solution. The implementation of the web application was up to the teams.

Our initial idea for the project was to archive [Reddit](https://www.reddit.com/) subreddits, posts, comments, and users, almost a re-designed Reddit page driven by some scraping/API service and scheduled via a cron job running on a cloud Linux VM. 

Fortunately and unfortunately, we were instructed to focus more on the data schema, defining the correct relationships, an [ERD diagram](https://www.lucidchart.com/pages/er-diagrams), and allowing users to update/add data as needed. The result is a bit less flattering of a project in terms of use case, ultimately being a data entry and review showcase via HTML responses, but it was a good example of clearly defining project objectives and deliverables.

The project was a great introduction to cloud-based data services as well. We initially developed on a local instance of a [Maria DB](https://mariadb.org/). We utilized a Python-based wrapper to execute the predefined SQL commands, constructed within the [`db_connection.py`](https://github.com/jaredtconnor/Reddit-Archiver/blob/master/db_connection.py) module. In hindsight, though we were instructed specifically _not_ to, I would recommend the use of an ORM, such as [SQLAlchemy](https://www.sqlalchemy.org/). This would likely be safer because it is a bit dangerous to be writing explicit SQL statements without proper measures to prevent malicious injections. 

HTML and templates were handled with [Jinja](https://jinja.palletsprojects.com/en/3.0.x/) templating. Hosting was handled by [Heroku](https://www.heroku.com/). Be mindful that the free dynos, so it will take a few seconds to spin up.

To move things to a cloud-based solution, we migrated everything up to an [AWS RDS MySql](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.MySQL.html) instance and defined the authentication within environment variables.

![Posts Form](/images/project_images/reddit_archiver/post_form.png)

## Learning Outcomes

 1. *Co-working*  - Co-working on a project is a ton of fun. Working with my partner on this project was enjoyable and a great lesson how to properly version control and push/pull changes to a collaborative repository.

 2. *Cloud Services* - This project provided a great introduction to using AWS/cloud-based services to develop applications. The overall application implementation was constrained by the project requirements, but utilizing and setting up a database in the cloud is a great skill to have. I use [DBeaver](https://dbeaver.io/) quite a bit for work, and this worked great to connect the running instance and upload/download the DDL files, edit data, and verify changes.

![Schema](/images/project_images/reddit_archiver/schema.png)

![ERD Diagram](/images/project_images/reddit_archiver/erd.png)

