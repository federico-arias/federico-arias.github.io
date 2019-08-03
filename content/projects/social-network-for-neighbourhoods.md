+++
title = "A social network for neighbourhoods"
description = "A social network that allowed buildings residents to communicate with each other and form communities."
type = "project"
tags = ["react", "redux", "go", "aws", "postgres"]
shorttitle = "Vecinbarrio"
mainimg = "vecinbarrio-jumbotron.png"
img = "vecinbarrio-bw.jpg"
+++

The solution proposed was a single-page 
application that relied on a Postgres
database for persistence. 

## FrontEnd 

One of the challenges of the project was
coordinating the work between two front-end
developers while I developed the backend and
part of the front-end. To this purpose, we 
used [Apiary][apiary] to simulate a REST API
interaction. Then, we just swapped Apiary's
URI with our backend.

I discovered [Nir Kaufman's design patterns][nir],
and decided to try them out,
ditching `redux-thunk` in favor of middlewares.
Centralizing all of our API calls in one
middleware proved to be a good decision. 
The only thing I changed was that in Nir's examples,
the actions triggered by an API call are 
constructed from a constant that holds 
the name of the action instead of building it from
an action creator function. 

To be able to parameterize the responses
generated from our API calls, I
modified his middleware design to accept 
action creators. In the process, I decided
to add yet another layer of abstraction to
some action creators and ended up with 
something you might call an action creator
creator in React parlance:

```javascript
export const fetchPublicationsSuccess = filter => data => ({
	type: FETCH_PUBLICATIONS_SUCCESS,
	filter,
	payload: normalize(data, publicationsSchema)
});
```

In this way, middlewares were able to 
parameterize the actions triggered by
API responses. 

## Deployment

Local development was done via `docker-compose`
while, deployment was handled by Heroku. I 
followed the [12 Factor app][12factor]
recomendations and had two similar environments
in a Heroku Pipeline.

[apiary]: https://www.apiary.io/
[nir]: https://www.youtube.com/watch?v=JUuic7mEs-s
[12factor]: https://12factor.net/
