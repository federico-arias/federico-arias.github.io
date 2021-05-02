+++
title = "Do pipes work like channels in Golang?"
description = "On the similarities between io.Pipe and channels in Go"
date = "2020-03-10"
draft = true
[taxonomies]
  category = "technologies"
  tag = "go"
+++



Reads     | Nil    | Closed
---       | ---    | ---
io.Pipe() | f      | f
chan      | blocks | zero value


Writes/Sends | Nil    | Closed
---          | ---    | ---
io.Pipe()    | f      | `ErrClosedPipe`
chan         | blocks | `panic`

# Fan-out with channels and Pipes
