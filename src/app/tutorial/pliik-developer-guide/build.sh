rm -rf html
pdflatex -output-directory=pdf pliik-developer-guide.tex
latexml --dest=html/pliik-developer-guide.xml pliik-developer-guide.tex
#latexmlpost --nodefaultcss --dest=html/pliik-developer-guide.html html/pliik-developer-guide.xml
latexmlpost --novalidate --css=style.css --dest=html/index.html html/pliik-developer-guide.xml
