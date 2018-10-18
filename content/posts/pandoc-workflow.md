---
title: "Writing research papers in Markdown with pandoc and Latex"
description: "A lightweight alternative to PDF documents with pandoc and a .tex template."
date: "2018-01-22"
---

Traditionally, writing a research paper involves the use of a word-processor like Microsoft Word or LibreOffice to comply with the formatting requirements posed by popular style guides like APA, Chicago or Harvard. These style guides have very specific demands regarding margins, font size, line height, citations and a myriad of other formatting options.

Wouldn't it be nice if you could forget about formating and just focus on the content? This is precisely the main objective of this post: to **show you how to include citations and comply with formatting guidelines using Latex and Markdown**, without the formatting hassle that comes with word-processors.

Let's take the following paper as an example.

{{< highlight markdown >}}
---
author: John Doe
title: A hipster stravaganza
shorttitle: In honor of Sokal
abstract: Lorem ipsum dolor sit amet 
---

# A very interesting section

Cold-pressed mumblecore \cite{Warhol199} crucifix kitsch aesthetic normcore. Bushwick XOXO portland 90's dolor bitters offal. Adipisicing velit cardigan subway tile pok pok tbh. Wayfarers taiyaki et, cornhole echo park snackwave selfies brunch poutine id vegan.

# Another very interesting section

Lorem ipsum dolor amet veniam hot chicken \cite{Mapplethorpe1999} tofu, echo park aliqua freegan photo booth kombucha live-edge schlitz taiyaki adaptogen. Deep v shaman 8-bit aesthetic, lomo ipsum messenger bag. Kombucha lyft viral celiac 8-bit skateboard. Cliche four dollar toast live-edge coloring book. Gluten-free id freegan, est art party cardigan iceland af tacos 8-bit.

{{< / highlight >}}

This is our expected result:

![research paper in apa][apa]

To achieve this in Latex, we would have to do something like this:

This file is formatted in Markdown. Taking this file as input, we could write a simple script (that we have called `md2latex` here) that converts this markdown file to a fully formatted PDF in the style of our choice:

{{< highlight bash>}}
$ md2latex template.tex mypaperinmarkdown.md 
{{< / highlight >}}

Here, `template.tex` corresponds to a Latex template and `mypaper.md` to our aforementioned markdown file. In the rest or this post, I'm going to walk you through the inner workings of this script. 

The first thing we have to do is to ensure that our post is formatted. For this 

{{< highlight latex >}}

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

{{< / highlight >}}

This is obviously a lot of boilerplate code for a single article. Even word processors seem like a better alternative than writing all this code. In order to solve this, we are going to replace every instance of content with a pandoc variable enclosed in __$__.


{{< highlight bash >}}
#!/bin/bash
TEMPLATE_FILE=$1
MARKDOWN_FILE=$2
# Converts Markdown to Latex using the specified template
pandoc --standalone --smart \
	--template $TEMPLATE_FILE \
	--from  markdown+raw_tex $MARKDOWN_FILE \
	--to latex \
-o output.tex 
# Converts latex to PDF
pdflatex output.tex 
biber output 
biber output 
pdflatex output.tex 
biber output 
pdflatex ${MARKDOWN_FILE%.*}.pdf
# Cleans up auxiliary files
rm output*
{{< / highlight >}}

## Bonus: Generating Markdown from R code				

One of the benefits of using Markdown instead of 

{{< highlight bash >}}
$ Rscript -e "require(knitr); require(markdown); knit('$RMDFILE.Rmd', '$RMDFILE.md');"
{{< / highlight >}}


[apa]: /research-paper-in-apa.png "A research paper written following APA guidelines"
