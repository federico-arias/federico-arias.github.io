+++
title = "Yet another take on Go middlewares"
description = "How to code your own Go middlewares"
date = "2020-01-22"
tags = "golang"
+++

I stole this idea from [Mat Ryer]. It's an implementation
of middlewares that relies on an adapter function. This function
decorates a group of middlewares when applied to an `http.Handler`.

```go
func Adapt(middlewares ...Middleware) Middleware {
	return func(h http.HandlerFunc) http.HandlerFunc {
		for _, m := range middlewares {
			h = m(h)
		}
		return h
	}
}
```

Something I did differently, as you might have noticed above,
is to name a `Middleware` type:

```go
type Middleware func(http.HandlerFunc) http.HandlerFunc
```

Also, in Mat's implementation, the middlewares are inseparablely
linked to their handlers. I choose to abstract away this chain of
middlewares instead. With this change, we make future modifications
more effective.

How is that so? Well, suppose you had 30 endpoints, each with the
same middleware chain. What happens if you want to add another
middleware between some of them? you'll have to change every one
of them. What happens if you abstract the group of middlewares
in one curried function?

You have to change it only once &copy;.

Also, this has the advantage of letting you change the middlewares
at runtime with a couple lines of code. An example of this could
be the case were you want to have a more detailed logging or some
special CORS configuration in your development server, and a
different one in your production machine.

```go
	if os.Getenv("ENVIRONMENT") == "development" {
		// Let's you change it with one line of code
		myMiddlewares = Adapt(Log, Auth, CORS)
	}
```

Another nifty modification is to replace the Adapt
function with a Chain method on the middleware function itself.

```go
func (mw Middleware) Chain(next Middleware) Middleware {
	return func(h http.HandlerFunc) http.HandlerFunc {
		return next(mw(h))
	}
}

```

This also has the small benefit of applying the middlewares in the
order in which they were defined, and makes it more readable, both
in the definition and in the implementation.

```go
	myMiddlewares = Logger().
		Chain(CORS()).
		Chain(Auth())
```


[Mat Ryer]: https://medium.com/@matryer/writing-middleware-in-golang-and-how-go-makes-it-so-much-fun-4375c1246e81
