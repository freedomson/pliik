# /=====================================================================\ #
# |  LaTeXML::Post::XSLT                                                | #
# | Postprocessor for XSL Transform                                     | #
# |=====================================================================| #
# | Part of LaTeXML:                                                    | #
# |  Public domain software, produced as part of work done by the       | #
# |  United States Government & not subject to copyright in the US.     | #
# |---------------------------------------------------------------------| #
# | Bruce Miller <bruce.miller@nist.gov>                        #_#     | #
# | http://dlmf.nist.gov/LaTeXML/                              (o o)    | #
# \=========================================================ooo==U==ooo=/ #

package LaTeXML::Post::XSLT;
use strict;
use XML::LibXML;
use XML::LibXSLT;
use LaTeXML::Post;
our @ISA = (qw(LaTeXML::Post::Processor));

our @SEARCH_SUBDIRS = qw(LaTeXML/dtd dtd .); 

sub process {
  my($self,$doc,%options)=@_;
  my $stylesheet = $self->getOption('stylesheet') 
    || "LaTeXML-".$self->getOption('format').".xsl";

  # Now find the actual stylesheet file
  if($stylesheet && !(-f $stylesheet)){
    foreach my $dir ($self->getSourceDirectory, $self->getDestinationDirectory, @INC){
      foreach my $sub (@SEARCH_SUBDIRS){
	my $file = "$dir/$sub/$stylesheet";
	if(-f $file){ $stylesheet = $file; last; }}}}

  # Finally, do the transform, if we found a stylesheet
  if(!$stylesheet || !(-f $stylesheet)){
    $self->Warn("No stylesheet found for \"$stylesheet\"");
    $doc; }
  else {
    my $ssdoc = XML::LibXML->new()->parse_file($stylesheet);
    my $xsl   = XML::LibXSLT->new()->parse_stylesheet($ssdoc);
    $self->Error("Stylesheet \"$stylesheet\" couldn't be read!") unless $xsl;
    my $css = $self->getOption('CSS');
    $xsl->transform($doc, ($css ? (CSS=>"'$css'") :())); }}

# ================================================================================
1;

