+++
title = "Do pipes work like channels in Golang?"
description = "On the similarities between io.Pipe and channels in Go"
date = "2020-03-10"
draft = true
[taxonomies]
  category = "technologies"
  tag = "go"
+++


```go
package client

import "service"

func NewClient() Client {
	s := new(service.Service)
	return Client{service: s}
}
```

A common pattern in software design is the service-client relationship. 
The **service** is the code that performs an operation whose inner workings are hidden behind a package, a class or a function. The **client**, for its part, it's the code that calls and uses those classes or packages. An common example of this relationship is the separation of persistence from business-domain logic. 

That is why we affirm that a client **depends** on a service. The content of this post deals with the various ways in which we can express that dependency with code.

One of the most common ways is to simply initialize this code within the client like this: 


In our service, we have public functions that let the client perform an operation such as retriving entities from a database or reading files from the filesystem.

This approach has a number of limitations. One of the most prominent is that we cannot isolate this portion of code for unit testing. To avoid this issue, we can define an interface instead of directly passing the `Service` type as a dependency.

```go
type IService interface {
	SomeMethod() string
}
```

In this way, if we want to test our client code in isolation we can mock our `Service` by implementing all of its methods:

```go
//Mock of Service that satisfies IService
type ServiceMock struct {
}

func (sm ServiceMock) ServiceMethod() string {
	return "Foo"
}
```

Then, in our tests, we can simply pass our mock instead of our entire service.

```go
func TestClient(t *testing.T) {
	c := NewClient(ServiceMock{})
	c.service.ServiceMethod()
}
```

As a sidenote, you could leverage the use of [promoted fields][pfields], which let you call directly. In this way, instead of writing.

This method of passing dependencies as 'children' from interfaces is not only limited to structs. If you have a one-method interface, you don't have to mock the whole thing, just its main function: 

```go
//Mock of Service that satisfies IService
type Getter func(int)string
type Updater func(int)string

type GetSetter interface {
	Getter
	Setter
}

```

Then, in your client code:

```go
//Mock of Service that satisfies IService
func NewClient(d ServiceMethod) Client {
	return Client{d:d}
}
```

And your mock will just be any function that satisfies that type.

[pfields][https://medium.com/golangspec/promoted-fields-and-methods-in-go-4e8d7aefb3e3]
[interfacevsfunc][https://stackoverflow.com/questions/31961536/function-types-vs-single-method-interfaces]
Pair learning (pair programming, tandem)
Problem-based (codewars, hackerrank, duolingo)
Twitch, Netflix
