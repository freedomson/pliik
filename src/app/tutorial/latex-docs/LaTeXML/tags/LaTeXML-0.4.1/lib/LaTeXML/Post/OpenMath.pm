# /=====================================================================\ #
# |  LaTeXML::Post::OpenMath                                            | #
# | OpenMath generator for LaTeXML                                      | #
# |=====================================================================| #
# | Part of LaTeXML:                                                    | #
# |  Public domain software, produced as part of work done by the       | #
# |  United States Government & not subject to copyright in the US.     | #
# |---------------------------------------------------------------------| #
# | Bruce Miller <bruce.miller@nist.gov>                        #_#     | #
# | http://dlmf.nist.gov/LaTeXML/                              (o o)    | #
# \=========================================================ooo==U==ooo=/ #

# ================================================================================
# LaTeXML::MathML  Math Formatter for LaTeXML's Parsed Math.
#   Cooperate with the parsed math structure generated by LaTeXML::Math and
# convert into presentation MathML.
# ================================================================================
# TODO
#  * merging of mrows when operator is `close enough' (eg (+ (+ a b) c) => (+ a b c)
#  * get presentation from DUAL
#  * proper parenthesizing (should I record the parens used when parsing?)
# Some clarity to work out:
#  We're trying to convert either parsed or unparsed math (sometimes intertwined).
# How clearly do these have to be separated?
# ================================================================================
package LaTeXML::Post::OpenMath;
use strict;
use LaTeXML::Util::LibXML;
use LaTeXML::Post;
our @ISA = (qw(LaTeXML::Post::Processor));

our $omURI = "http://www.openmath.org/OpenMath";

sub process {
  my($self,$doc)=@_;
  $doc->documentElement->setNamespace($omURI,'om',0);
  my @math = $self->find_math_nodes($doc);
  $self->Progress("Converting ".scalar(@math)." formulae");
  foreach my $math (@math){
    my ($xmath) = $math->getChildrenByTagNameNS($self->getNamespace,'XMath');
    my $ommath = $self->processNode($xmath);
    $math->appendChild($ommath); }
  $doc; }

# ================================================================================
sub find_math_nodes {
  my($self,$doc)=@_;
  $doc->getElementsByTagNameNS($self->getNamespace,'Math'); }

# ================================================================================

sub processNode {
  my($self,$math)=@_;
  my $ommath=new_node($omURI,'OMOBJ',[]);

  # NOTE: Should be only 1 node by now?
  my @nodes= element_nodes($math);
  append_nodes($ommath, map(Expr($_), @nodes));

  $ommath; }

sub getEncodingName { 'OpenMath'; }
# ================================================================================

sub getTokenName {
  my($node)=@_;
  my $m = $node->getAttribute('name') || $node->textContent;
  (defined $m ? $m : '?'); }

# ================================================================================
our $OMTable={};

sub DefOpenMath {
  my($key,$sub) =@_;
  $$OMTable{$key} = $sub; }

sub Expr {
  my($node)=@_;
  return OMError("Missing Subexpression") unless $node;
  my $tag = $node->nodeName;
  if($tag eq 'XMDual'){
    my($content,$presentation) = element_nodes($node);
    Expr($content); }
  elsif($tag eq 'XMWrap'){
    # Note... Error?
    Row(grep($_,map(Expr($_),element_nodes($node)))); }
  elsif($tag eq 'XMApp'){
    my($op,@args) = element_nodes($node);
    return OMError("Missing Operator") unless $op;
    my $name =  getTokenName($op);
    my $pos  =  $op->getAttribute('role') || '?';

    my $sub = $$OMTable{"Apply:$pos:$name"} || $$OMTable{"Apply:?:$name"} 
      || $$OMTable{"Apply:$pos:?"} || $$OMTable{"Apply:?:?"};
    &$sub($op,@args); }
  elsif($tag eq 'XMTok'){
    my $name =  getTokenName($node);
    my $pos  =  $node->getAttribute('role') || '?';
    my $sub = $$OMTable{"Token:$pos:$name"} || $$OMTable{"Token:?:$name"} 
      || $$OMTable{"Token:$pos:?"} || $$OMTable{"Token:?:?"};
    &$sub($node); }
  elsif($tag eq 'XMHint'){
    undef; }
  else {
    Node('OMSTR',[$node->textContent]); }}

# ================================================================================
# Helpers
sub Node {
  my($tag,$content,%attr)=@_;
  new_node($omURI,"om:$tag",$content,%attr); }

sub OMError {
  my($msg)=@_;
  Node('OME',Node('OMS',[],name=>'unexpected', cd=>'moreerrors'),Node('OMS',$msg)); }
# ================================================================================
# Tokens

# Note: In general, there needs to be a lot more support/analysis.
# Here, we simply assume that the token is a variable if there's no CD!!!
DefOpenMath('Token:?:?',    sub { 
  my($token)=@_;
  my $name = getTokenName($token);
  my $cd = $token->getAttribute('omcd');
  if($cd){
    Node('OMS',[], name=>$name, cd=>$cd); }
  else {
    Node('OMV',[], name=>$name); }});

# NOTE: Presence of '.' distinguishes float from int !?!?
DefOpenMath('Token:NUMBER:?',sub {
  my($node)=@_;
  my $value = getTokenName($node); # name attribute (may) holds actual value.
  if($value =~ /\./){
    Node('OMF',[],dec=>$value); }
  else {
    Node('OMI',$value); }});

DefOpenMath("Token:?:\x{2062}", sub {
    Node('OMS',[], name=>'times', cd=>'arith1'); });

# ================================================================================
# Applications.

# Generic

DefOpenMath('Apply:?:?', sub {
  my($op,@args)=@_;
  Node('OMA',[map(Expr($_),$op,@args)]); });

# NOTE: No support for OMATTR here...

# NOTE: Sketch of what OMBIND support might look like.
# Currently, no such construct is created in LaTeXML...
DefOpenMath('Apply:LambdaBinding:?', sub {
  my($op,$expr,@vars)=@_;
  Node('OMBIND',[Node('OMS',[],name=>"lambda", cd=>'fns1'),
		 Node('OMBVAR',[map(Expr($_),@vars)]), # Presumably, these yield OMV
		 Expr($expr)]); });

# ================================================================================
1;
