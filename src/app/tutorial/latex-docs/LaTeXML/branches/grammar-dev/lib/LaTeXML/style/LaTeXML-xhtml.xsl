<?xml version="1.0" encoding="utf-8"?>
<!--
/=====================================================================\ 
|  LaTeXML-xhtml.xsl                                                  |
|  Stylesheet for converting LaTeXML documents to xhtml               |
|=====================================================================|
| Part of LaTeXML:                                                    |
|  Public domain software, produced as part of work done by the       |
|  United States Government & not subject to copyright in the US.     |
|=====================================================================|
| Bruce Miller <bruce.miller@nist.gov>                        #_#     |
| http://dlmf.nist.gov/LaTeXML/                              (o o)    |
\=========================================================ooo==U==ooo=/
-->
<xsl:stylesheet
    version     = "1.0"
    xmlns:xsl   = "http://www.w3.org/1999/XSL/Transform"
    xmlns:ltx   = "http://dlmf.nist.gov/LaTeXML"
    xmlns       = "http://www.w3.org/1999/xhtml"
    exclude-result-prefixes = "ltx">
<!--
    xmlns:m     = "http://www.w3.org/1998/Math/MathML"
    xmlns:svg   = "http://www.w3.org/2000/svg"
-->
  <xsl:output method="xml"
	      doctype-public = "-//W3C//DTD XHTML 1.1 plus MathML 2.0//EN"
	      doctype-system = "http://www.w3.org/Math/DTD/mathml2/xhtml-math11-f.dtd"
	      media-type     = 'application/xhtml+xml'
	      encoding       = 'utf-8'
	      indent         = "yes"/>

  <xsl:template name="metatype">
    <meta http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8"/>
  </xsl:template>

  <xsl:template match="/"> 
  <!-- This version generates MathML & SVG with an xmlns namespace declaration on EACH node;
       If you want to declare and use namespace prefixes (m & svg, resp), add this here
	  xmlns:m   = "http://www.w3.org/1998/Math/MathML"
	  xmlns:svg = "http://www.w3.org/2000/svg"
       and change local-name() to name() in LaTeXML-math-mathml & LaTeXML-picture-svg. -->
    <html xmlns     = "http://www.w3.org/1999/xhtml">
      <xsl:copy-of select="/ltx:document/namespace::*[not(local-name() = 'ltx')]"/>
      <xsl:copy-of select="/ltx:document/@prefix"/><!-- DG: RDFa prefix -->
      <xsl:call-template name="head"/>
      <xsl:call-template name="body"/><xsl:text>
    </xsl:text>
    </html>
  </xsl:template>

<xsl:include href="urn:x-LaTeXML:stylesheets:LaTeXML-common.xsl"/>
<xsl:include href="urn:x-LaTeXML:stylesheets:LaTeXML-inline-xhtml.xsl"/>
<xsl:include href="urn:x-LaTeXML:stylesheets:LaTeXML-block-xhtml.xsl"/>
<xsl:include href="urn:x-LaTeXML:stylesheets:LaTeXML-para-xhtml.xsl"/>
<xsl:include href="urn:x-LaTeXML:stylesheets:LaTeXML-math-mathml.xsl"/>
<xsl:include href="urn:x-LaTeXML:stylesheets:LaTeXML-tabular-xhtml.xsl"/>
<xsl:include href="urn:x-LaTeXML:stylesheets:LaTeXML-picture-svg.xsl"/>
<xsl:include href="urn:x-LaTeXML:stylesheets:LaTeXML-structure-xhtml.xsl"/>
<xsl:include href="urn:x-LaTeXML:stylesheets:LaTeXML-bib-xhtml.xsl"/>
<xsl:include href="urn:x-LaTeXML:stylesheets:LaTeXML-webpage-xhtml.xsl"/>

</xsl:stylesheet>


