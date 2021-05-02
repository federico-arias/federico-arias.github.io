+++
title = "A quick tip to format PDFs documents for e‑readers using the Linux command line"
date = 2018-10-10
draft = false
+++

Most e-book readers fail to display PDF documents in a legible font size, due to their inability to dynamically insert line breaks according to available width. Instead, you are forced to zoom-in and focus on only one portion of the document. 

A way to solve this problem would be cutting the margins using `pdfcrop`. For example, if we wanted to remove 88 pts from both left and right margins we'll do:

```bash
$ pdfcrop --margins "-88 0 -88 0" book.pdf
```

The problem with this approach is that it'll make old e-book readers to display a pair of black stripes where margins used to be. A better approach is using `pdfjam` to scale your PDF by a fixed factor:

```bash
$ pdfjam --scale 1.46 book.pdf
```

In this way, you retain the original width of the document and avoid the black stripes. 

To arrive at the amount by which you'll have to scale this document you might have to try a couple of different factors and adjust accordingly. For this, it might be better to work with a single page instead of the whole document. To extract one page, you can use `pdftk` in the following fashion:

```bash
$ pdftk book.pdf cat 33 output page.pdf
```
