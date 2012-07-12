<!--
 /=====================================================================\ 
 |  LaTeXML-qname-1.dtd                                                |
 | Modular DTD qnames for LaTeXML generated documents                  |
 |=====================================================================|
 | Part of LaTeXML:                                                    |
 |  Public domain software, produced as part of work done by the       |
 |  United States Government & not subject to copyright in the US.     |
 |=====================================================================|
 | Bruce Miller <bruce.miller@nist.gov>                        #_#     |
 | http://dlmf.nist.gov/LaTeXML/                              (o o)    |
 \=========================================================ooo==U==ooo=/
-->

<!-- ======================================================================
     Document Structure -->

<!ENTITY % LaTeXML.document.qname       "%LaTeXML.pfx;document">
<!ENTITY % LaTeXML.book.qname           "%LaTeXML.pfx;book">
<!ENTITY % LaTeXML.part.qname           "%LaTeXML.pfx;part">
<!ENTITY % LaTeXML.chapter.qname        "%LaTeXML.pfx;chapter">
<!ENTITY % LaTeXML.section.qname        "%LaTeXML.pfx;section">
<!ENTITY % LaTeXML.subsection.qname     "%LaTeXML.pfx;subsection">
<!ENTITY % LaTeXML.subsubsection.qname  "%LaTeXML.pfx;subsubsection">
<!ENTITY % LaTeXML.paragraph.qname      "%LaTeXML.pfx;paragraph">
<!ENTITY % LaTeXML.bibliography.qname   "%LaTeXML.pfx;bibliography">

<!ENTITY % LaTeXML.appendix.qname       "%LaTeXML.pfx;appendix">

<!ENTITY % LaTeXML.title.qname          "%LaTeXML.pfx;title">
<!ENTITY % LaTeXML.toctitle.qname       "%LaTeXML.pfx;toctitle">
<!ENTITY % LaTeXML.author.qname         "%LaTeXML.pfx;author">
<!ENTITY % LaTeXML.creationdate.qname   "%LaTeXML.pfx;creationdate">
<!ENTITY % LaTeXML.thanks.qname         "%LaTeXML.pfx;thanks">
<!ENTITY % LaTeXML.abstract.qname       "%LaTeXML.pfx;abstract">


<!ENTITY % LaTeXML-structure.SectionalFrontMatter.class
	 "%LaTeXML.title.qname; | %LaTeXML.toctitle.qname; | %LaTeXML.author.qname;">
<!ENTITY % LaTeXML-structure.FrontMatter.class
         "| %LaTeXML.creationdate.qname; | %LaTeXML.thanks.qname; | %LaTeXML.abstract.qname;">
<!ENTITY % LaTeXML-structure.BackMatter.class
	 "%LaTeXML.bibliography.qname; | %LaTeXML.appendix.qname;">
