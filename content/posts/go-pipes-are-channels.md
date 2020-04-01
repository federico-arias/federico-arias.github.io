+++
title = "Do pipes work like channels in Golang?"
description = "On the similarities between io.Pipe and channels in Go"
date = "2020-03-10"
draft = true
[taxonomies]
  category = "technologies"
  tag = "go"
+++

What happens when you try to read from an empty channel? It blocks.
What happens when you try to read from an `io.Pipe()`. I does the
same thing?

a         | Nil | Closed | Open
---       | --- | ---    | ---
io.Pipe() | f   | f      | f
chan      | f   | f      | f
