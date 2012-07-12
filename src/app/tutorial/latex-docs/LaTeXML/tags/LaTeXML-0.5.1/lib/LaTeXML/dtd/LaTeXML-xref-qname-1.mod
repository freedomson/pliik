<!--
 /=====================================================================\ 
 |  LaTeXML-xref-qname-1.mod                                           |
 | LaTeXML DTD Module for cross-references                             |
 |=====================================================================|
 | Part of LaTeXML:                                                    |
 |  Public domain software, produced as part of work done by the       |
 |  United States Government & not subject to copyright in the US.     |
 |=====================================================================|
 | Bruce Miller <bruce.miller@nist.gov>                        #_#     |
 | http://dlmf.nist.gov/LaTeXML/                              (o o)    |
 \=========================================================ooo==U==ooo=/
-->

<!ENTITY % LaTeXML.ref.qname       "%LaTeXML.pfx;ref">
<!ENTITY % LaTeXML.cite.qname      "%LaTeXML.pfx;cite">
<!ENTITY % LaTeXML.citepre.qname   "%LaTeXML.pfx;citepre">
<!ENTITY % LaTeXML.citepost.qname  "%LaTeXML.pfx;citepost">
<!ENTITY % LaTeXML.a.qname         "%LaTeXML.pfx;a">

<!ENTITY % LaTeXML-xref.Inline.class 
	 "| %LaTeXML.ref.qname; | %LaTeXML.cite.qname; | %LaTeXML.a.qname;">
