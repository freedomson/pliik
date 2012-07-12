<?xml version="1.0" encoding="utf-8"?>
<!--
/=====================================================================\ 
|  LaTeXML-html5.xsl                                                  |
|  Stylesheet for converting LaTeXML documents to html5               |
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
    version   = "1.0"
    xmlns:xsl = "http://www.w3.org/1999/XSL/Transform"
    xmlns:ltx = "http://dlmf.nist.gov/LaTeXML"
    exclude-result-prefixes="ltx">

  <xsl:output
      method = "html"
      omit-xml-declaration="yes"
      encoding       = 'utf-8'
      indent         = 'yes'
      media-type     = 'text/html'/>

  <xsl:template name="metatype">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  </xsl:template>

  <xsl:template name="add_id">
    <xsl:if test="@fragid">
      <xsl:attribute name="id"><xsl:value-of select="@fragid"/></xsl:attribute>
    </xsl:if>
  </xsl:template>

  <xsl:template match="/">
    <xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html></xsl:text>
    <html>
      <xsl:call-template name="head"/>
      <xsl:call-template name="body"/>
    </html>
  </xsl:template>

<xsl:include href="LaTeXML-common.xsl"/>
<xsl:include href="LaTeXML-inline-html.xsl"/>
<xsl:include href="LaTeXML-block-html.xsl"/>
<xsl:include href="LaTeXML-para-html5.xsl"/>
<xsl:include href="LaTeXML-math-mathml-html5.xsl"/>
<xsl:include href="LaTeXML-tabular-html.xsl"/>
<xsl:include href="LaTeXML-picture-svg-html5.xsl"/>
<xsl:include href="LaTeXML-structure-html5.xsl"/><!-- *** -->
<xsl:include href="LaTeXML-bib-html.xsl"/>

<xsl:include href="LaTeXML-webpage-html5.xsl"/>

</xsl:stylesheet>
