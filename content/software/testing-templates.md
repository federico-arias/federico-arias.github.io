+++
title = "Testing templates in Golang"
date = "2019-06-12"
+++

Templates in Go are a great tool for rendering HTML in our web app.
Unfortunately, to test if they are functioning as expected, we
often are forced to run our app in a browser and visually inspect
their results.

To avoid running our entire app each time we want to test a template,
we can follow the example of Javascript libraries like [Enzyme][enzyme],
which test React.js components by traversing the DOM and verifying 
the presence of certain nodes. We can mimic this behavior usign
Go's [html package][html]. 

A simple `Find()` function like the one below (based in Douglas
Crockford [function to traverse the dom][douglas]) could provide 
a way to find the elements we expect in our templates based in the
data we have passed to them.

```go
type filter func(*html.Node) bool

//returns a node based on criteria set by 
//the filter function
func Find(node *html.Node, fn filter) (*html.Node, bool) {
	if node.Type == html.ElementNode && fn(node) {
		return node, true
	}
	for c := node.FirstChild; c != nil; c = c.NextSibling {
		if n, b := Find(c, fn); b == true {
			return n, true
		}
	}
	return node, false
}
```

The following is an example of a filter function that retrieves
DOM elements based on the name and value of a node attribute.

```go
func ByAttr(attrName, attrValue string) filter {
	return func(node *html.Node) bool {
		for _, a := range node.Attr {
			if a.Key == attrName && a.Val == attrValue {
				return true
			}
		}
		return false
	}
}
```

Then, in our unit tests, we could simply parse the response and 
look for the relevant nodes. 

```go
	//...
	root, err := html.Parse(response.Body)
	if err != nil {
		t.Error(err)
	}
	n, found := Find(root, ByAttr("name", "user"))
	if !found {
		t.Error(err)
		t.Logf("The element found is <%s>, expected <input>", n.Data)
	}
	//...
```

[douglas]: https://www.javascriptcookbook.com/article/traversing-dom-subtrees-with-a-recursive-walk-the-dom-function/
[html]: https://godoc.org/golang.org/x/net/html
[enzyme]: https://airbnb.io/enzyme/

