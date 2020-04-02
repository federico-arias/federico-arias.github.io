+++
title = "Standardized error handling in Go HTTP handlers using func receivers"
date = "2020-04-01"
tags = "golang"
+++

One of the particularities of Go is that you can create "methods"
using functions as receivers. We'll take advantage of that fact to
make the handling of errors in `http.Handler`s DRYer.

What I mean by DRYer? Look at this example:

```go
func myHandler(w http.ResponseWriter, r *http.Request) {
	err := doSomething()
    if err != nil {
		logger.Print("doSomething() didn't work :(")
        http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
        return
    }

    err := doSomethingElse()
    if err != nil {
		logger.Print("doSomethingElse() didn't work :(")
        http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
        return
    }
	// ...
}
```

This code:

1. **Is not very DRY**: logging, writing an error and returning are repeated with little variation.
2. **Is hard to test**: you'll have to inspect the HTTP Response for errors.
3. **Is open for error**: you can forget to return at the end of the if statement.

How are we going to solve this? We'll create a new `HandlerWithError` type
that returns an error and abstracts error handling:

```go
type HandlerWithError func(http.ResponseWriter, *http.Request) error

func (h HandlerWithError) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	err := h(w, r)
	if err != nil {
		// Logging, etc.
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}
```

In this way, we can place all of our logic inside the `ServeHTTP`
function.

This is a very simple example and is not going to work in
all but very simple cases. You should probably modify the
`HandlerWithError` to return a custom struct instead of a primitive
value to account for more cases. This is left as an exercise for
the reader ;).

Here is the full working example:

```go
package main

import (
	"errors"
	"net/http"
)

type HandlerWithError func(http.ResponseWriter, *http.Request) error

func main() {
	http.Handle("/", myHandler())
	http.ListenAndServe(":8080", nil)
}

func myHandler() HandlerWithError {
	return func(w http.ResponseWriter, r *http.Request) error {
		return errors.New("you, fools")
	}
}

func (h HandlerWithError) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	err := h(w, r)
	if err != nil {
		WriteHeader(http.StatusInternalServerError)
	}
}
```
