#Dependes on LaTeXML version 0.7.9alpha

rm -rf html
rm favicon.ico

cp ../../pic/favicon.ico .
cp ../../../app/pic/Blue_wave_of_water-wide.jpg html/

pdflatex -output-directory=pdf pliik-developer-guide.tex
latexml --dest=html/pliik-developer-guide.xml pliik-developer-guide.tex
#latexmlpost --nodefaultcss --dest=html/pliik-developer-guide.html html/pliik-developer-guide.xml
latexmlpost  --navigationtoc=context --icon=favicon.ico --javascript=bootstrap.js --novalidate --css=navbar-right --css=style.css --dest=html/index.html html/pliik-developer-guide.xml


rm html/style.css
rm html/favicon.ico

cd html
ln -s ../style.css .
ln -s ../../../pic/favicon.ico .


