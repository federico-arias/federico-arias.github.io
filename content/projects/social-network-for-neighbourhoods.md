+++
title = "A social network for neighbourhoods"
description = "Used React, Redux, Go and Postgres in Heroku to build"
type = "project"
tags = ["react", "redux", "go", "aws", "postgres"]
shorttitle = "Vecinbarrio"
mainimg = "vecinbarrio-jumbotron.png"
img = "vecinbarrio-bw.jpg"
+++

A single page application that uses. 

## FrontEnd 

The React, Redux, Typescript combo was used to take
advantage of composability and to get rid of the 
problems that were caused by a lack of type-safety
in previous projects. 

I opted for Semantic-UI instead of Bootstrap to
get a more polished look.

<!--![A screenshot of the project][screenshot 1]-->

I also continued to work with [Nir Kaufman's design patterns
][nir], ditching `react-thunk` in favor of middlewares.

## Backend 

I am growing more and more fond of Go and decided to use it
for this project. I didn't use any framework, only the
following packages:

* Migrate to manage migrations.
* Go-Mock to mock interfaces.
* Gorilla router.

## Deployment

Local development was done via `docker-compose`
while, deployment was handled by Heroku. 
