# /=====================================================================\ #
# |  LaTeXML::Post::MathML                                              | #
# | MathML generator for LaTeXML                                        | #
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
#  * Need switches for Presentation and/or Content 

#  * merging of mrows when operator is `close enough' (eg (+ (+ a b) c) => (+ a b c)
#  * get presentation from DUAL
#  * proper parenthesizing (should I record the parens used when parsing?)
# Some clarity to work out:
#  We're trying to convert either parsed or unparsed math (sometimes intertwined).
# How clearly do these have to be separated?
# ================================================================================

package LaTeXML::Post::MathML;
use strict;
use LaTeXML::Util::LibXML;
use base qw(LaTeXML::Post::Processor);

our $mmlURI = "http://www.w3.org/1998/Math/MathML";

#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
# See END for specific converters.
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
# Top level
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
sub process {
  my($self,$doc)=@_;
  $self->cacheIDs($doc);
  $doc->documentElement->setNamespace($mmlURI,'m',0);
  my @ltx_maths = $self->find_math_nodes($doc);
  $self->Progress("Converting ".scalar(@ltx_maths)." formulae");
  foreach my $ltx_math (@ltx_maths){
    my $mode = $ltx_math->getAttribute('mode')||'inline';
    my ($xmath) = $ltx_math->getChildrenByTagNameNS($self->getNamespace,'XMath');
    my $mml_math= $ltx_math->addNewChild($mmlURI,'math');
    $mml_math->setAttribute(display=>($mode eq 'display' ? 'block' : 'inline'));
    incorporate($mml_math,$mmlURI,$self->processNode($xmath)); }
  $doc; }

# ================================================================================
sub find_math_nodes {
  my($self,$doc)=@_;
  $doc->getElementsByTagNameNS($self->getNamespace,'Math'); }

# Recursively incorporate the intermediate form MathML data into the XML node.
# The intermediate form is either an array:
#   [tag,{attributes},@children]
#    where the children are also intermediate forms
# or a string, to be text content.

sub incorporate {
  my($node,$nsuri,@data)=@_;
  foreach my $child (@data){
    if(ref $child eq 'ARRAY'){
      my($tag,$attributes,@children)=@$child;
      my $new = $node->addNewChild($nsuri,$tag);
      $node->appendChild($new);
      if($attributes){
	foreach my $key (keys %$attributes){
	  $new->setAttribute($key, $$attributes{$key}) if defined $$attributes{$key}; }}
      incorporate($new,$nsuri,@children); }
#    elsif((ref $child) =~ /^XML::LibXML::/){
#      $node->appendChild($child); }
    elsif(ref $child){
      warn "Dont know how to add $child to $node; ignoring"; }
    else {
      $node->appendTextNode($child); }}}

#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
# General translation utilities.
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

sub getTokenName {
  my($node)=@_;
  my $m = $node->getAttribute('name') || $node->textContent;
  (defined $m ? $m : '?'); }

sub realize {
  my($node)=@_;
  $LaTeXML::Post::PROCESSOR->realizeXMNode($LaTeXML::Post::DOCUMENT,$node); }

#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
# Table of Translators for presentation|content
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
# All translators take XMath XML::LibXML nodes as arguments,
# and return an intermediate form of MathML to be added.

our $MMLTable_P={};
our $MMLTable_C={};

sub DefMathML {
  my($key,$presentation,$content) =@_;
  $$MMLTable_P{$key} = $presentation if $presentation;
  $$MMLTable_C{$key} = $content if $content; }

sub lookupPresenter {
  my($mode,$role,$name)=@_;
  $name = '?' unless $name;
  $role = '?' unless $role;
  $$MMLTable_P{"$mode:$role:$name"} || $$MMLTable_P{"$mode:?:$name"}
    || $$MMLTable_P{"$mode:$role:?"} || $$MMLTable_P{"$mode:?:?"}; }

sub lookupContent {
  my($mode,$role,$name)=@_;
  $name = '?' unless $name;
  $role = '?' unless $role;
  $$MMLTable_C{"$mode:$role:$name"} || $$MMLTable_C{"$mode:?:$name"}
    || $$MMLTable_C{"$mode:$role:?"} || $$MMLTable_C{"$mode:?:?"}; }


#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
# Support functions for Presentation MathML
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

sub pmml {
  my($node)=@_;
  my $o = $node->getAttribute('open');
  my $c = $node->getAttribute('close');
  my $p = $node->getAttribute('punctuation');
  my $result = ($node->nodeName eq 'XMRef' ? pmml(realize($node)) : pmml_internal($node));
  $result = ( $o || $c ? pmml_parenthesize($result,$o,$c) : $result); 
  ($p ? ['mrow',{},$result,pmml_mo($p)] : $result); }

sub pmml_internal {
  my($node)=@_;
  return ['merror',{},['mtext',{},"Missing Subexpression"]] unless $node;
  my $tag = $node->nodeName;
  if($tag eq 'XMath'){
    pmml_row(map(pmml($_), element_nodes($node))); } # Really multiple nodes???
  elsif($tag eq 'XMDual'){
    my($content,$presentation) = element_nodes($node);
    pmml($presentation); }
  elsif($tag eq 'XMWrap'){	# Only present if parsing failed!
    pmml_row(map(pmml($_),element_nodes($node))); }
  elsif($tag eq 'XMApp'){
    my($op,@args) = element_nodes($node);
    if(!$op){
      ['merror',{},['mtext',{},"Missing Operator"]]; }
    else {
      $op = realize($op);		# NOTE: Could loose open/close on XMRef ???
      &{ lookupPresenter('Apply',$op->getAttribute('role'),getTokenName($op)) }($op,@args); }}
  elsif($tag eq 'XMTok'){
    &{ lookupPresenter('Token',$node->getAttribute('role'),getTokenName($node)) }($node); }
  elsif($tag eq 'XMHint'){
    &{ lookupPresenter('Hint',$node->getAttribute('role'),getTokenName($node)) }($node); }
  else {
    ['mtext',{},$node->textContent]; }}

sub pmml_row {
  my(@items)=@_;
  @items = grep($_,@items);
  (scalar(@items) == 1 ? $items[0] : ['mrow',{},@items]); }

sub pmml_parenthesize {
  my($item,$open,$close)=@_;
  if(!$open && !$close){
    $item; }
  elsif($item && (ref $item)  && ($item->[0] eq 'mrow')){
    my($tag,$attr,@children)=@$item;
    ['mrow',$attr,($open ? (pmml_mo($open)):()),@children,($close ? (pmml_mo($close)):())]; }
  else {
    ['mrow',{},($open ? (pmml_mo($open)):()),$item,($close ? (pmml_mo($close)):())]; }}

sub pmml_punctuate {
  my($separators,@items)=@_;
  $separators='' unless defined $separators;
  my $lastsep=', ';
  my @arglist;
  if(@items){
    push(@arglist,pmml(shift(@items)));
    while(@items){
      $separators =~ s/^(.)//;
      $lastsep = $1 if $1;
      push(@arglist,pmml_mo($lastsep),pmml(shift(@items))); }}
  pmml_row(@arglist); }


# args are XMath nodes
sub pmml_infix {
  my($op,@args)=@_;
  return ['mrow',{}] unless $op && @args; # ??
  my @items=();
  if(scalar(@args) == 1){	# Infix with 1 arg is presumably Prefix!
    push(@items,(ref $op ? pmml($op) : pmml_mo($op)),pmml($args[0])); }
  else {
    push(@items, pmml(shift(@args)));
    while(@args){
      push(@items,(ref $op ? pmml($op) : pmml_mo($op)));
      push(@items,pmml(shift(@args))); }}
  pmml_row(@items); }

# Mappings between internal fonts & sizes.
# Default math font is roman|medium|upright.
our %mathvariants = ('bold'             =>'bold',
		     'italic'           =>'italic',
		     'bold italic'      =>'bold-italic',
		     'doublestruck'     =>'double-struck',
		     'fraktur bold'     => 'bold-fraktur',
		     'script'           => 'script',
		     'script italic'    => 'script',
		     'script bold'      => 'bold-script',
		     'caligraphic'      => 'script',
		     'caligraphic bold' => 'bold-script',
		     'fraktur'          => 'fraktur',
		     'sansserif'        => 'sans-serif',
		     'sansserif bold'   => 'bold-sans-serif',
		     'sansserif italic' => 'sans-serif-italic',
		     'sansserif bold italic'   => 'sans-serif-bold-italic',
		     'typewriter'       => 'monospace');

sub pmml_mi {
  my($item)=@_;
  my $font    = (ref $item ? $item->getAttribute('font') : undef);
  my $variant = ($font && $mathvariants{$font})||'';
  my $content = (ref $item ?  $item->textContent : $item);
  if($content =~ /^.$/){	# Single char?
    if($variant eq 'italic'){ $variant = ''; } # Defaults to italic
    elsif(!$variant){ $variant = 'normal'; }}  # must say so explicitly.
  ['mi',{($variant ? (mathvariant=>$variant) : ())},$content]; }

sub pmml_mo {
  my($op)=@_;
  my $font    = (ref $op ? $op->getAttribute('font') : undef);
  my $variant = $font && $mathvariants{$font};
  my $content = (ref $op ? $op->textContent : $op);
  ['mo',{($variant ? (mathvariant=>$variant) : ()),
	 # If an operator has specifically located it's scripts, don't let mathml move them.
	 (((ref $op && $op->getAttribute('stackscripts'))||'no') eq 'yes' ? (movablelimits=>'false'):())},
   $content]; }

#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
# Support functions for Content MathML
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

sub cmml {
  my($node)=@_;
  return ['merror',{},['mtext',{},"Missing Subexpression"]] unless $node;
  $node = realize($node) if $node->nodeName eq 'XMRef';
  my $tag = $node->nodeName;
  if($tag eq 'XMath'){
    my($item,@rest)=  element_nodes($node);
    print STDERR "Warning! got extra nodes for content!\n" if @rest;
    cmml($item); }
  elsif($tag eq 'XMDual'){
    my($content,$presentation) = element_nodes($node);
    cmml($content); }
  elsif($tag eq 'XMWrap'){	# Only present if parsing failed!
    pmml_row(map(pmml($_),element_nodes($node))); } # ????
  elsif($tag eq 'XMApp'){
    my($op,@args) = element_nodes($node);
    if(!$op){
      ['merror',{},['mtext',{},"Missing Operator"]]; }
    else {
      $op = realize($op);		# NOTE: Could loose open/close on XMRef ???
      &{ lookupContent('Apply',$op->getAttribute('role'),getTokenName($op)) }($op,@args); }}
  elsif($tag eq 'XMTok'){
    &{ lookupContent('Token',$node->getAttribute('role'),getTokenName($node)) }($node); }
  elsif($tag eq 'XMHint'){	# ????
    &{ lookupContent('Hint',$node->getAttribute('role'),getTokenName($node)) }($node); }
  else {
    ['mtext',{},$node->textContent]; }}

# Or csymbol if there's some kind of "defining" attribute?
sub cmml_ci {
  my($item)=@_;
  my $font    = (ref $item ? $item->getAttribute('font') : undef);
  my $variant = ($font && $mathvariants{$font})||'';
  my $content = (ref $item ?  $item->textContent : $item);
  if($content =~ /^.$/){	# Single char?
    if($variant eq 'italic'){ $variant = ''; } # Defaults to italic
    elsif(!$variant){ $variant = 'normal'; }}  # must say so explicitly.
#  ['csymbol',{($variant ? (mathvariant=>$variant) : ())},$content]; }
  ['ci',{},$content]; }

#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
# Tranlators
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
# An issue here:
#  Some constructs are pretty purely presentational.  Hopefully, these would
# only appear in XWrap's or in the presentation branch of an XMDual, so we won't
# attempt to convert them to content.  But if we do, should we warn?
# ================================================================================
# Tokens

DefMathML("Token:?:?",           \&pmml_mi, \&cmml_ci);

DefMathML("Token:ADDOP:?",       \&pmml_mo);
DefMathML("Token:ADDOP:+",       undef,     sub { ['plus'];});
DefMathML("Token:ADDOP:-",       undef,     sub { ['minus'];});

DefMathML("Token:MULOP:?",       \&pmml_mo);
DefMathML("Token:MULOP:*",       undef,     sub { ['times'];});
DefMathML("Token:MULOP:\x{2062}",undef,     sub { ['times'];});
DefMathML("Token:MULOP:/",       undef,     sub { ['divide'];});

DefMathML("Token:RELOP:?",      \&pmml_mo);
DefMathML("Token:RELOP:=",       undef,     sub { ['eq'];});
DefMathML("Token:RELOP:\x{2260}",undef,     sub { ['neq'];}); # \ne, not-eq .. ???
DefMathML("Token:RELOP:>",       undef,     sub { ['gt'];});
DefMathML("Token:RELOP:<",       undef,     sub { ['lt'];});
DefMathML("Token:RELOP:leq",     undef,     sub { ['leq'];}); # NOTE: Unify \le and \leq
DefMathML("Token:RELOP:geq",     undef,     sub { ['geq'];}); # NOTE: Unify \ge and \geq

DefMathML("Token:PUNCT:?",       \&pmml_mo);
DefMathML("Token:SUMOP:?",       \&pmml_mo);
DefMathML("Token:INTOP:?",       \&pmml_mo);
DefMathML("Token:LIMITOP:?",     \&pmml_mo);
DefMathML("Token:OPERATOR:?",    \&pmml_mo);
DefMathML("Token:OPEN:?",        \&pmml_mo);
DefMathML("Token:CLOSE:?",       \&pmml_mo);
DefMathML("Token:MIDDLE:?",      \&pmml_mo);
DefMathML("Token:VERTBAR:?",     \&pmml_mo);
DefMathML("Token:ARROW:?",       \&pmml_mo);
DefMathML("Token:METARELOP:?",   \&pmml_mo);
DefMathML("Token:OVERACCENT:?",  \&pmml_mo);
DefMathML("Token:UNDERACCENT:?", \&pmml_mo);

DefMathML("Token:NUMBER:?",sub { ['mn',{},$_[0]->textContent]; },sub { ['cn',{},$_[0]->textContent]; });
DefMathML("Token:?:Empty", sub { ['none']} );

DefMathML("Token:?:\x{2061}", \&pmml_mo); # FUNCTION APPLICATION
DefMathML("Token:?:\x{2062}", \&pmml_mo); # INVISIBLE TIMES


DefMathML("Token:FUNCTION:exp",      undef, sub { ['exp']; });
DefMathML("Token:FUNCTION:ln",       undef, sub { ['ln']; });
DefMathML("Token:FUNCTION:log",      undef, sub { ['log']; });
DefMathML("Token:FUNCTION:sin",      undef, sub { ['sin']; });
DefMathML("Token:FUNCTION:cos",      undef, sub { ['cos']; });
DefMathML("Token:FUNCTION:tan",      undef, sub { ['tan']; });
DefMathML("Token:FUNCTION:sec",      undef, sub { ['sec']; });
DefMathML("Token:FUNCTION:csc",      undef, sub { ['csc']; });
DefMathML("Token:FUNCTION:cot",      undef, sub { ['cot']; });
DefMathML("Token:FUNCTION:sinh",     undef, sub { ['sinh']; });
DefMathML("Token:FUNCTION:cosh",     undef, sub { ['cosh']; });
DefMathML("Token:FUNCTION:tanh",     undef, sub { ['tanh']; });
DefMathML("Token:FUNCTION:sech",     undef, sub { ['sech']; });
DefMathML("Token:FUNCTION:csch",     undef, sub { ['csch']; });
DefMathML("Token:FUNCTION:coth",     undef, sub { ['coth']; });
DefMathML("Token:FUNCTION:arcsin",   undef, sub { ['arcsin']; });
DefMathML("Token:FUNCTION:arccos",   undef, sub { ['arccos']; });
DefMathML("Token:FUNCTION:arctan",   undef, sub { ['arctan']; });
DefMathML("Token:FUNCTION:arccosh",  undef, sub { ['arccosh']; });
DefMathML("Token:FUNCTION:arccot",   undef, sub { ['arccot']; });
DefMathML("Token:FUNCTION:arccoth",  undef, sub { ['arccoth']; });
DefMathML("Token:FUNCTION:arccsc",   undef, sub { ['arcscsc']; });
DefMathML("Token:FUNCTION:arccsch",  undef, sub { ['arccsch']; });
DefMathML("Token:FUNCTION:arcsec",   undef, sub { ['arcsec']; });
DefMathML("Token:FUNCTION:arcsech",  undef, sub { ['arcsech']; });
DefMathML("Token:FUNCTION:arcsinh",  undef, sub { ['arcsinh']; });
DefMathML("Token:FUNCTION:arctanh",  undef, sub { ['arctanh']; });


# Token elements:
#   cn, ci, csymbol
# Basic Content elements:
#   apply, interval, inverse, sep, condition, declare, lambda, compose, ident,
#   domain, codomain, image, domainofapplication, piecewise, piece, otherwise
# Arithmetic, Algebra and Logic:
#   quotient, factorial, divide, max, min, minus, plus, power, rem, times, root
#   gcd, and, or, xor, not, implies, forall, exists, abs, conjugate, arg, real,
#   imaginary, lcm, floor, ceiling.
# Relations:
#   eq, neq, gt, lt, geq, leq, equivalent, approx, factorof
# Calculus and Vector Calculus:
#   int, diff, partialdiff, lowlimit, uplimit, bvar, degree, 
#   divergence, grad, curl, laplacian.
# Theory of Sets,
#   set, list, union, intersect, in, notin, subset, prsubset, notsubset, notprsubset,
#   setdiff, card, cartesianproduct.
# Sequences and Series:
#   sum, product, limit, tendsto
# Elementary Classical Functions,
#   exp, ln, log, sin, cos tan, sec, csc, cot, sinh, cosh, tanh, sech, csch, coth,
#   arcsin, arccos, arctan, arccosh, arccot, arccoth, arccsc, arccsch, arcsec, arcsech,
#   arcsinh, arctanh
# Statistics:
#   mean, sdev, variance, median, mode, moment, momentabout
# Linear Algebra:
#   vector, matrix, matrixrow, determinant, transpose, selector, 
#   vectorproduct, scalarproduct, outerproduct.
# Semantic Mapping Elements
#   annotation, semantics, annotation-xml
# Constant and Symbol Elements
#   integers, reals, rationals, naturalnumbers, complexes, primes,
#   exponentiale, imaginaryi, notanumber, true, false, emptyset, pi,
#   eulergamma, infinity

# ================================================================================
# Hints
DefMathML('Hint:?:?', sub { undef; });
# ================================================================================
# Applications.

# NOTE: A lot of these special cases could be eliminated by
# consistent creation of XMDual's (using DefMath and similar)

DefMathML('Apply:?:?', 
	  sub {
	    my($op,@args)=@_;
	    ['mrow',{},
	     pmml($op),pmml_mo("\x{2061}"),	# FUNCTION APPLICATION
	     pmml_parenthesize(pmml_punctuate($op->getAttribute('separators'),@args),
			       $op->getAttribute('argopen'),$op->getAttribute('argclose'))]; },
	  sub {
	    my($op,@args)=@_;
	    ['apply',{},cmml($op), map(cmml($_),@args)]; });

DefMathML('Apply:OVERACCENT:?', sub {
  my($accent,$base)=@_;
  ['mover',{accent=>'true'}, pmml($base),pmml($accent)]; });

DefMathML('Apply:UNDERACCENT:?', sub {
  my($accent,$base)=@_;
  ['munder',{accent=>'true'}, pmml($base),pmml($accent)]; });

# Top level relations
DefMathML('Apply:?:Formulae',sub { 
  my($op,@elements)=@_;
  pmml_punctuate($op->getAttribute('separators'),@elements); });

DefMathML('Apply:?:MultiRelation',sub { 
  my($op,@elements)=@_;
  pmml_row(map(pmml($_),@elements)); });

# Defaults for various parts-of-speech

# For DUAL, just translate the presentation form.
DefMathML('Apply:?:DUAL', sub { pmml($_[2]); });

DefMathML('Apply:?:Superscript', sub {
  my($op,$base,$sup)=@_;
  [((($base->getAttribute('stackscripts')||'no') eq 'yes') ? 'mover' : 'msup'),{},
   pmml($base),pmml($sup)]; });

DefMathML('Apply:?:Subscript',   sub {
  my($op,$base,$sub)=@_;
  [((($base->getAttribute('stackscripts')||'no') eq 'yes') ? 'munder' : 'msub'),{},
   pmml($base),pmml($sub)]; });

DefMathML('Apply:?:SubSuperscript',   sub { 
  my($op,$base,$sub,$sup)=@_;
  [((($base->getAttribute('stackscripts')||'no') eq 'yes') ? 'munderover' : 'msubsup'),{},
   pmml($base),pmml($sub),pmml($sup)]; });

DefMathML('Apply:POSTFIX:?',     sub { ['mrow',{},pmml($_[1]),pmml($_[0])]; });

DefMathML('Apply:?:sideset', sub {
  my($op,$presub,$presup,$postsub,$postsup,$base)=@_;
  ['mmultiscripts',{},
   pmml($base),pmml($postsub),pmml($postsup), 
   ['mprescripts'],pmml($presub),pmml($presup)]; });

DefMathML('Apply:ADDOP:?', \&pmml_infix);
DefMathML('Apply:MULOP:?', \&pmml_infix);
DefMathML('Apply:RELOP:?', \&pmml_infix);
DefMathML('Apply:ARROW:?', \&pmml_infix);
DefMathML('Apply:METARELOP:?',\&pmml_infix);

DefMathML('Apply:FENCED:?',sub {
  my($op,@elements)=@_;
  pmml_parenthesize(pmml_punctuate($op->getAttribute('separators'),@elements),
		    $op->getAttribute('argopen'), $op->getAttribute('argclose')); });

# Various specific formatters.
DefMathML('Apply:?:sqrt', sub { ['msqrt',{},pmml($_[1])]; });
DefMathML('Apply:?:root', sub { ['mroot',{},pmml($_[2]),pmml($_[1])]; });

# NOTE: Need to handle displaystyle
# It is only handled here by assuming that it is already true!!!
# Need to bind and control it!!!!!
DefMathML('Apply:?:/', sub {
  my($op,$num,$den)=@_;
  my $style = $op->getAttribute('style') || '';
  if($style eq 'inline'){
    ['mfrac',{bevelled=>'true'}, pmml($num),pmml($den)]; }
  elsif($style eq 'display') {
    ['mfrac',{},pmml($num),pmml($den)]; }
  else {
    ['mstyle',{displaystyle=>'false'},['mfrac',{},pmml($num),pmml($den)]]; }
});

# NOTE: the $pow is either undef or an XMath node!!
sub pmml_pow {
  my($base,$pow)=@_;
  (defined $pow ? ['msup',{},$base,pmml($pow)] : $base); }

# NOTE: Need to handle displaystyle
sub pmml_deriv {
  my($diffop,$op,$expr,$var,$n)=@_;
  ['mfrac',{(($op->getAttribute('style')||'') eq 'inline' ? (bevelled=>'true') : ())},
   ['mrow',{},pmml_pow(pmml_mo($diffop),$n),pmml($expr)],
   pmml_pow(['mrow',{},pmml_mo($diffop),pmml($var)],$n)]; }

DefMathML('Apply:?:deriv',  sub { pmml_deriv("\x{2146}",@_); }); # DOUBLE-STRUCK ITALIC SMALL D
DefMathML('Apply:?:pderiv', sub { pmml_deriv("\x{2202}",@_); }); # PARTIAL DIFFERENTIAL

DefMathML('Apply:?:LimitFrom', sub {
  my($op,$arg,$dir)=@_;
  ['mrow',{},pmml($arg),pmml($dir)]; });

DefMathML('Apply:?:diff', sub {  
  my($op,$x,$n)=@_;
  ['mrow',{},pmml_pow(pmml_mo("\x{2146}"),$n),pmml($x)]; }); # DOUBLE-STRUCK ITALIC SMALL D

DefMathML('Apply:?:pdiff', sub {  
  my($op,$x,$n)=@_;
  ['mrow',{},pmml_pow(pmml_mo("\x{2202}"),$n),pmml($x)]; }); # PARTIAL DIFFERENTIAL

DefMathML('Apply:?:Cases', sub {
  my($op,@cases)=@_;
  ['mrow',{},pmml_mo('{'), ['mtable',{},map(pmml($_),@cases)]]; });

DefMathML('Apply:?:Case',sub {
  my($op,@cells)=@_;
  ['mtr',{},map(pmml($_),@cells)]; });

DefMathML('Apply:?:Array', sub {
  my($op,@rows)=@_;
  ['mtable',{},map(pmml($_),@rows)]; });

DefMathML('Apply:?:Matrix', sub {
  my($op,@rows)=@_;
  pmml_parenthesize(['mtable',{},map(pmml($_),@rows)],
		    $op->getAttribute('open'),$op->getAttribute('close')); });

DefMathML('Apply:?:Row',sub {
  my($op,@cells)=@_;
  ['mtr',{},map(pmml($_),@cells)]; });

DefMathML('Apply:?:Cell',sub {
  my($op,@content)=@_;
  ['mtd',{},map(pmml($_),@content)]; });

DefMathML('Apply:?:binomial', sub {
  my($op,$over,$under)=@_;
  pmml_parenthesize(['mtable',{}, 
		     ['mtr',{},['mtd',{},pmml($over)]],
		     ['mtr',{},['mtd',{},pmml($under)]]], '(',')'); });

DefMathML('Apply:?:pochhammer',sub {
  my($op,$a,$b)=@_;
  ['msub',{}, pmml_parenthesize(pmml($a),'(',')'),pmml($b)]; });

DefMathML('Apply:?:stacked', sub {
  my($op,$over,$under)=@_;
  ['mtable',{},
   ['mtr',{},['mtd',{},pmml($over)]],
   ['mtr',{},['mtd',{},pmml($under)]]]; });

DefMathML('Apply:?:Annotated', sub {
  my($op,$var,$annotation)=@_;
  ['mrow',{},pmml($var),pmml($annotation)];});

# Have to deal w/ screwy structure:
# If denom is a sum/diff then last summand can be: cdots, cfrac 
#  or invisibleTimes of cdots and something which could also be a cfrac!
# NOTE: Deal with cfracstyle!!
sub do_cfrac {
  my($numer,$denom)=@_;
  if($denom->nodeName eq 'XMApp'){ # Denominator is some kind of application
    my ($denomop,@denomargs)=element_nodes($denom);
    if(($denomop->getAttribute('role')||'') eq 'ADDOP'){ # Is it a sum or difference?
      my $last = pop(@denomargs);			# Check last operand in denominator.
      # this is the current contribution to the cfrac (if we match the last term)
      my $curr = ['mfrac',{},pmml($numer),['mrow',{},pmml_infix($denomop,@denomargs),pmml($denomop)]];
      if(getTokenName($last) eq 'cdots'){ # Denom ends w/ \cdots
	return ($curr,pmml($last));}		   # bring dots up to toplevel
      elsif($last->nodeName eq 'XMApp'){	   # Denom ends w/ application --- what kind?
	my($lastop,@lastargs)=element_nodes($last);
	if(getTokenName($lastop) eq 'cfrac'){ # Denom ends w/ cfrac, pull it to toplevel
#	  return ($curr,do_cfrac(@lastargs)); }
	  return ($curr,pmml($last)); }
	elsif((getTokenName($lastop) eq "\x{2062}")  # Denom ends w/ * (invisible)
	      && (scalar(@lastargs)==2) && (getTokenName($lastargs[0]) eq 'cdots')){
	  return ($curr,pmml($lastargs[0]),pmml($lastargs[1])); }}}}
  (['mfrac',{},pmml($numer),pmml($denom)]); }

DefMathML('Apply:?:cfrac', sub {
  my($op,$numer,$denom)=@_;
  pmml_row(do_cfrac($numer,$denom)); });

# NOTE: Markup probably isn't right here....
DefMathML('Apply:?:AT', sub {
  my($op,$expr,$value)=@_;
  pmml_row(pmml($expr),['msub',{},pmml_mo('|'),pmml($value)]); });

#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
# Specific converters for Presentation, Content, or Parallel.
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

#================================================================================
# Presentation MathML
package LaTeXML::Post::MathML::Presentation;
use strict;
use base qw(LaTeXML::Post::MathML);

sub processNode { LaTeXML::Post::MathML::pmml($_[1]); }
sub getEncodingName { 'MathML-Presentation'; }

#================================================================================
# Content MathML
package LaTeXML::Post::MathML::Content;
use strict;
use base qw(LaTeXML::Post::MathML);

sub processNode { LaTeXML::Post::MathML::cmml($_[1]); }
sub getEncodingName { 'MathML-Content'; }

#================================================================================
# Parallel MathML
package LaTeXML::Post::MathML::Parallel;
use strict;
use base qw(LaTeXML::Post::MathML);

sub processNode {
  my($self,$node)=@_;
  my($main_proc,@annotation_procs)=@{$$self{math_processors}};
  ['semantics',{},
   $main_proc->processNode($node),
   map( ['annotation-xml',{encoding=>$_->getEncodingName},$_->processNode($node)],
	@annotation_procs) ]; }
sub getEncodingName { 'MathML-Parallel'; }

#================================================================================

1;
