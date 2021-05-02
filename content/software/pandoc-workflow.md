+++
title = "Writing research papers in Markdown with pandoc and LaTex (Part I: Style guide formatting)"
description = "A lightweight alternative to PDF documents with pandoc and a .tex template."
date = "2018-10-24"
draft = false
+++

Those of us that have grown accustomed to the pristine
simplicity of writing and coding in environments like Vim, Emacs or even Notepad dread the times when we are forced to use word processors like Microsoft Word, LibreOffice or Pages. This often happens when we need to write a research paper or some document that requires special formatting. Whether it be [APA][wiki-apa], [MLA][wiki-mla], The Chicago Manual of Style, or any other style guide, all of them present very specific demands regarding margins, font size, line height, citations and a myriad of other formatting options.

Wouldn't it be nice if we could forget about formatting and just focus on the content? This is precisely the main objective of this post: to **show you how to comply with formatting guidelines using only Markdown**, without troubling with the hassle that comes with word processors.

We are going to accomplish this in two steps:

1. First, we are going to use [Latex][wiki-latex] to **create a template for one specific style guide** (We'll use APA for the purposes of this example). In this template file we'll abstract all the configuration options so we can focus on the content in a separate Markdown document.

2. Second, we are going to **take our document in Markdown and transform it** using [pandoc][2]. This document is going to be free from any formatting options. By performing this separation, we can take it and convert it to a document in another style guide, to a blog post, or even to a slideshow presentation.

This is one of the main advantages of [separating content from formatting][1]: you get the flexibility of applying multiple formats to the same content (this very blog post was written using markdown and then converted to HTML by [Hugo, a static site generator][4]).

Let's get to it then. We'll be using the following paper as an example.

```highlight markdown
---
author: John Doe
title: A hipster stravaganza
shorttitle: A hipster stravaganza
abstract: Lorem ipsum dolor sit amet
affiliation: APLAPLAC University
---

# Introduction

Markdown is a lightweight markup language with plain text formatting syntax.
It is designed so that it can be converted to HTML and many other formats using a tool by
the same name. Markdown is often used to format readme files, for writing messages
in online discussion forums, and to create rich text using a plain text editor.

# A very interesting section

John Gruber created the Markdown language in 2004 in collaboration with Aaron Swartz on the syntax, with the goal of enabling people "to write using an easy-to-read and easy-to-write plain text format, optionally convert it to structurally valid XHTML (or HTML)".

```

If we wanted to style this paper according to APA formatting guidelines, we'll expect to end up with something like this:

{{< figure src="/apa-paper.jpg" >}}

To do this using LaTex, we'll have to write such amount of boilerplate code that it would make word processors look as the user-friendliest of alternatives:

```latex
\documentclass[a4paper,man]{apa6}

\usepackage[english]{babel}
\usepackage[utf8x]{inputenc}

\title{A hipster stravaganza}
\shorttitle{A hipster stravaganza}
\author{John Doe}
\affiliation{APLAPLAC University}

\abstract{Lorem ipsum dolor sit amet.}

\begin{document}
\maketitle

\section{Introduction}

Markdown is a lightweight markup language with plain text formatting syntax. It is designed so that it can be converted to HTML and many other formats using a tool by the same name.[8] Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

\section{A very interesting section}

John Gruber created the Markdown language in 2004 in collaboration with Aaron Swartz on the syntax, with the goal of enabling people "to write using an easy-to-read and easy-to-write plain text format, optionally convert it to structurally valid XHTML (or HTML)".

\end{document}
```

Instead of writing all this boilerplate code every time for every article, we are going to transform this into a pandoc LaTex template. In this template, we'll replace the contents with pandoc variables enclosed by dollar signs (`$`).

```latex
\documentclass[a4paper,man,biblatex,12pt]{apa6}
\usepackage{longtable}
\usepackage[spanish]{babel}
\usepackage[utf8]{inputenc}
\usepackage[style=apa,sortcites=true,sorting=nyt,backend=biber]{biblatex}
\addbibresource{$bibliography$}
\title{$title$}
\shorttitle{$shorttitle$}
\author{$name$}
\affiliation{}
\abstract{$abstract$}
\begin{document}
\maketitle
$body$
\printbibliography
\end{document}
```

Once we call pandoc, it'll replace these variables with the ones found in our [YAML][3]‑formatted front matter in our Markdown document. An exception to this is the special variable `$body$`, which is going to be replaced by our whole Markdown document transformed into LaTex.

To do this, we call pandoc with the following arguments:

```bash
$ pandoc --standalone --smart \
	--template apa.tex \
	--from  markdown+raw_tex myfile.md \
	--to latex \
	--output output.tex
```

Afterwards, we call `pdflatex` to transform the generated LaTex file into a PDF document.

```bash
$ pdflatex output.tex
```

We can transform this into a bash script to abbreviate the process:

```bash
#!/bin/bash
TEMPLATE_FILE=$1
MARKDOWN_FILE=$2
# converts markdown to LaTex
pandoc --standalone --smart \
	--template $TEMPLATE_FILE \
	--from  markdown+raw_tex $MARKDOWN_FILE \
	--to latex \
-o output.tex
# converts LaTex to PDF
pdflatex output.tex
# renames file
mv output.pdf ${MARKDOWN_FILE%.*}.pdf
# cleans up auxiliary files
rm output*
```

To use this script, we'll simply have to provide a template and a markdown file with the contents of our paper.

```bash
$ ./md2latex apa-template.tex mypaper.md
```

Here, `apa-template.tex` corresponds to a LaTex template and `mypaper.md` to our markdown file.

Next Steps
----------

Stay tuned for part two of this post, in which we are going to look at some alternatives to include citations and bibliographies using a minimal amount of LaTex.

[1]: https://en.wikipedia.org/wiki/Separation_of_content_and_presentation
[2]: https://en.wikipedia.org/wiki/Pandoc
[3]: https://en.wikipedia.org/wiki/YAML
[4]: https://gohugo.io/
[apa]: /apa-paper.jpg "A research paper written following APA guidelines"
[wiki-latex]: https://en.wikipedia.org/wiki/LaTeX
[wiki-apa]: https://en.wikipedia.org/wiki/APA_style
[wiki-mla]: https://en.wikipedia.org/wiki/MLA_Style_Manual
