<?xml version="1.0" encoding="utf-8"?>
<!--
/=====================================================================\ 
|  LaTeXML-picture-svg.xsl                                            |
|  Converting pictures to SVG for xhtml                               |
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
    xmlns:svg   = "http://www.w3.org/2000/svg">
  
  <!-- Copy SVG, as is ???? -->
  <xsl:template match="*[namespace-uri() = 'http://www.w3.org/2000/svg']">
    <!-- A note on namespaces: Use
	 * name() for the prefixed name (see LaTeXML-xhtml for reqd xmlns:m declaration)
	 * local-name() gets the unprefixed name, but with xmlns on EACH node.
	 If you omit the namespace= on xsl:element, you get the un-namespaced name (eg.html5)-->
    <xsl:element name="{local-name()}" namespace='http://www.w3.org/2000/svg'>
      <xsl:for-each select="@*">
	<xsl:attribute name="{name()}"><xsl:value-of select="."/></xsl:attribute>
      </xsl:for-each>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

</xsl:stylesheet>
