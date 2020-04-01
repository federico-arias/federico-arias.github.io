+++
title = "Integrating single page applications (SPA) with Golang"
description = ""
date = "2019-12-29"
draft = true
+++

It's generally considered a best practice to separate your
SPA from your landing page. The landing page needs to load fast
to attract your users to test your app and, to do this, it doesn't
need much more than a static site.

To achieve this, server-side, I use a handler that redirects
everything to the React bundle.

```go
package handlers

import (
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
)

// Handles calls to SPA.
func SPA(prefix, spaDir, spaPath string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// strips the prefix from path
		r2 := new(http.Request)
		path := strings.TrimPrefix(r.URL.Path, prefix)
		if len(path) < len(r.URL.Path) {
			*r2 = *r
			r2.URL = new(url.URL)
			*r2.URL = *r.URL
			r2.URL.Path = path
		}

		// prepend the path with the path to the static directory
		path = filepath.Join(spaDir, path)

		// get the absolute path to prevent directory traversal
		path, err := filepath.Abs(path)
		if err != nil {
			// if we failed to get the absolute path respond with
			// a 400 bad request
			// and stop
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// check whether a file exists at the given path
		_, err = os.Stat(path)
		if os.IsNotExist(err) {
			// file does not exist, serve index.html
			http.ServeFile(w, r, filepath.Join(
				spaDir, spaPath,
			))
			return
		} else if err != nil {
			// if we got an error (that wasn't that the file doesn't exist) stating the
			// file, return a 500 internal server error and stop
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// otherwise, use http.FileServer to serve the static dir
		http.FileServer(http.Dir(spaDir)).ServeHTTP(w, r2)
	}
}
```
