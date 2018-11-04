+++
title = "Writing research papers in Markdown with pandoc and LaTex (Part I: Style guide formatting)"
description = "A lightweight alternative to PDF documents with pandoc and a .tex template."
date = "2018-10-24"
draft = false
+++

Traditionally, writing a research paper involves the use of a word-processor like Microsoft Word or LibreOffice. We use these software to comply with the formatting requirements posed by style guides like Chicago, APA or Harvard. These style guides have very specific demands regarding margins, font size, line height, citations and a myriad of other formatting options.

Wouldn't it be nice if we could forget about formating and just focus on the content? This is precisely the main objective of this post: to **show you how to comply with formatting guidelines using LaTex and Markdown**, without troubling with the hassle that comes with word-processors.

Let's take the following paper as an example.

```highlight markdown 
---
author: John Doe
title: A hipster stravaganza
shorttitle: A hipster stravaganza
abstract: Lorem ipsum dolor sit amet 
affiliation: APLAPLAC University
---

# Introduction 

Markdown is a lightweight markup language with plain text formatting syntax. It is designed so that it can be converted to HTML and many other formats using a tool by the same name. Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor. 

# A very interesting section

John Gruber created the Markdown language in 2004 in collaboration with Aaron Swartz on the syntax, with the goal of enabling people "to write using an easy-to-read and easy-to-write plain text format, optionally convert it to structurally valid XHTML (or HTML)".

```

This is our expected result:

{{< figure src="/apa-paper.jpg" >}}

To produce a properly formatted APA paper using LaTex, we would have to do something like this:

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

This is obviously a lot of boilerplate code for a single article. Even word processors seem like a better alternative than writing all this code. In order to solve this, we are going to abstract away every piece that does not belongs to the content of the article. 


```latex

\documentclass[a4paper,man,biblatex,12pt]{apa6}
\usepackage{longtable} 
\usepackage[spanish]{babel}
\usepackage[utf8]{inputenc}
\usepackage[style=spanish]{csquotes}
\usepackage{times}
\usepackage[style=apa,sortcites=true,sorting=nyt,backend=biber]{biblatex}
\DeclareLanguageMapping{spanish}{spanish-apa}
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

We can create a bash script that performs all of these steps:

```bash
#!/bin/bash
TEMPLATE_FILE=$1
MARKDOWN_FILE=$2
# transforms markdown to LaTex
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

To use this script, you'll simply have to provide a template and a markdown file with the contents of your paper.

```bash
$ md2latex apa-template.tex mypaperinmarkdown.md 
```

Here, `template.tex` corresponds to a LaTex template and `mypaper.md` to our aforementioned markdown file. In the rest or this post, I'm going to walk you through the inner workings of this script. 

Next Steps
----------

In the next part of this article, we are going to review some alternatives to include citations an bibliographies using minimal latex inside our markdown. 

[apa]: /apa-paper.jpg "A research paper written following APA guidelines"
