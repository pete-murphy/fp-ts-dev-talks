#!/bin/sh

pandoc -s -t beamer --pdf-engine=xelatex -o slides.pdf slides.md -V theme:metropolis
