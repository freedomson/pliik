# /=====================================================================\ #
# |  LaTeXML::Document                                                 | #
# | Constructs the Document from digested material                      | #
# |=====================================================================| #
# | Part of LaTeXML:                                                    | #
# |  Public domain software, produced as part of work done by the       | #
# |  United States Government & not subject to copyright in the US.     | #
# |---------------------------------------------------------------------| #
# | Bruce Miller <bruce.miller@nist.gov>                        #_#     | #
# | http://dlmf.nist.gov/LaTeXML/                              (o o)    | #
# \=========================================================ooo==U==ooo=/ #

package LaTeXML::Document;
use strict;
use LaTeXML::Global;
use Unicode::Normalize;
use base qw(LaTeXML::Object);

#**********************************************************************
# These two element names are `leaks' of the document structure into
# the Core of LaTeXML... In principle, we should be more abstract!

our $FONT_ELEMENT_NAME = "ltx:text";
our $MATH_TOKEN_NAME   = "ltx:XMTok";
#**********************************************************************

# [could conceivable make more sense to let the Stomach create the Document?]

# Mystery attributes:
#    font :
#       Probably should keep font ONLY in extra properties, 
#        THEN once complete, compute the relative font at each node that accepts
#       a font attribute, and add the attribute.
#   locator : a box

sub new {
  my($class,$model)=@_;
  my $doc = XML::LibXML::Document->new("1.0","UTF-8");
  # We'll set the DocType when the 1st Element gets added.
  bless { document=>$doc, node=>$doc, model=>$model,
	  idstore=>{}, labelstore=>{},
	  node_fonts=>{}, node_boxes=>{}, node_properties=>{}, 
	  pending=>[], progress=>0},$class; }

#**********************************************************************
# Accessors

# This will be a node of type XML_DOCUMENT_NODE
sub getDocument { $_[0]->{document}; }
sub getModel    { $_[0]->{model}; }

# Get the node representing the current insertion point.
# The node will have nodeType of
#   XML_DOCUMENT_NODE if the document is empty, so far.
#   XML_ELEMENT_NODE  for normal elements.
#   XML_TEXT_NODE     if the last insertion was text
# The other node types will not appear here.
sub getNode     { $_[0]->{node}; }
sub setNode     { $_[0]->{node} = $_[1]; }

sub getElement {
  my($self)=@_;
  my $node = $$self{node};
  $node = $node->parentNode if $node->getType == XML_TEXT_NODE;
  ($node->getType == XML_DOCUMENT_NODE ? undef : $node); }

sub getChildElements {
  my($self,$node)=@_;
  grep( $_->nodeType == XML_ELEMENT_NODE, $node->childNodes); }

sub getLastChildElement {
  my($self,$node)=@_;
  if($node->hasChildNodes){
    my $n = $node->lastChild;
    while($n && $n->nodeType != XML_ELEMENT_NODE){
      $n = $node->previousSibling; }
    return $n; }}

sub getFirstChildElement {
  my($self,$node)=@_;
  if($node->hasChildNodes){
    my $n = $node->firstChild;
    while($n && $n->nodeType != XML_ELEMENT_NODE){
      $n = $n->nextSibling; }
    return $n; }}

# And some utilities
sub getNodePath {
  my($self,$levels)=@_;
  my $node = $$self{node};
  my $path = Stringify($node);
  while($node = $node->parentNode){
    if((defined $levels) && (--$levels <= 0)){ $path = '...'.$path; last; }
    $path = Stringify($node).$path; }
  $path; }

sub findnodes {
  my($self,$xpath,$node)=@_;
  $$self{model}->getXPath->findnodes($xpath,($node || $$self{document})); }

# Handy when you expect only one, or want only first.
sub findnode {
  my($self,$xpath,$node)=@_;
  my @nodes = $$self{model}->getXPath->findnodes($xpath,($node || $$self{document})); 
  (@nodes ? $nodes[0] : undef); }

# Get the node's qualified name in standard form
# Ie. using the registered prefix for that namespace.
# NOTE: Reconsider how _Capture_ & _WildCard_ should be integrated!?!
# NOTE: Should Deprecate! (use model)
sub getNodeQName {
  my($self,$node)=@_;
  $$self{model}->getNodeQName($node); }

#**********************************************************************

# This should be called before returning the final XML::LibXML::Document to the
# outside world.  It resolves the fonts for each node relative to it's ancestors.
# It removes the `helper' attributes that store fonts, source box, etc.
sub finalize {
  my($self)=@_;
  if(my $root = $self->getDocument->documentElement){
    local $LaTeXML::FONT = $self->getNodeFont($root);
    $self->finalize_rec($root); }
  $$self{document}; }

sub finalize_rec {
  my($self,$node)=@_;
  my $model = $$self{model};
  my $qname = $model->getNodeQName($node);
  my $declared_font = $LaTeXML::FONT;
  if(my $font_attr = $node->getAttribute('_font')){
    if($model->canHaveAttribute($qname,'font') 
       && ($node->hasChildNodes || $node->getAttribute('_force_font'))){
      my $font = $$self{node_fonts}{$font_attr};
      if(my %fontdecl = $font->relativeTo($LaTeXML::FONT)){
	foreach my $attr (keys %fontdecl){
	  $node->setAttribute($attr=>$fontdecl{$attr}) if $model->canHaveAttribute($qname,$attr); }
	$declared_font = $font; }}}

  local $LaTeXML::FONT = $declared_font;
  foreach my $child ($node->childNodes){
    if($child->nodeType == XML_ELEMENT_NODE){
      $self->finalize_rec($child);
      # Also check if child is  $FONT_ELEMENT_NAME, has no attributes
      # If so, and providing $node can contain that child's content, we'll collapse it.
      if(($model->getNodeQName($child) eq $FONT_ELEMENT_NAME) && !$child->hasAttributes){
	$self->unwrapNodes($child); }
    }}
  # Attributes that begin with (the semi-legal) "_" are for Bookkeeping.
  # Remove them now.
  foreach my $attr ($node->attributes){
    my $n = $attr->nodeName;
    $node->removeAttribute($n) if $n =~ /^_/; }
}

#**********************************************************************
# Record nodes by id

sub recordID {
  my($self,$id,$object)=@_;
  if(my $prev = $$self{idstore}{$id}){ # Whoops! Already assigned!!!
    # Can we recover?
    my $badid = $id;
    $id = $self->modifyID($id);
    if($$self{idstore}{$id}){
      Fatal(":malformed ID attribute xml:id=$badid duplicated on ".Stringify($object)
	    ." was set on ".Stringify($prev)."\n using $id instead"
	    ." AND we ran out of adjustments!!"); }
    else {
###      Error(":malformed ID attribute xml:id=$badid duplicated on ".Stringify($object)
      Info(":malformed ID attribute xml:id=$badid duplicated on ".Stringify($object)
	    ." was set on ".Stringify($prev)."\n using $id instead"); }}
  $$self{idstore}{$id}=$object; 
  $id; }

sub unRecordID {
  my($self,$id)=@_;
  delete $$self{idstore}{$id}; }

# Get a new, related, but unique id
sub modifyID {
  my($self,$id)=@_;
  if(my $prev = $$self{idstore}{$id}){ # Whoops! Already assigned!!!
    # Can we recover?
    my $badid = $id;
    foreach my $post (ord('a')..ord('z')){ # And if THIS fails!?!??!
      last unless $$self{idstore}{$id = $badid.chr($post)}; }}
  $id; }

sub lookupID {
  my($self,$id)=@_;
  $$self{idstore}{$id}; }

#**********************************************************************

# Record the Box that created this node.
sub setNodeBox {
  my($self,$node,$box)=@_;
  return unless $box;
  my $boxid = "$box";
  $$self{node_boxes}{$boxid} = $box;
  $node->setAttribute(_box=>$boxid); }

sub getNodeBox {
  my($self,$node)=@_;
  my $t =  $node->nodeType;
  return undef if $t != XML_ELEMENT_NODE;
  if(my $boxid = $node->getAttribute('_box')){
    $$self{node_boxes}{$boxid}; }}

sub setNodeFont {
  my($self,$node,$font)=@_;
#  my $fontid = "$font";
  my $fontid = $font->toString;
  $$self{node_fonts}{$fontid} = $font;
  if($node->nodeType == XML_ELEMENT_NODE){
    $node->setAttribute(_font=>$fontid); }
  else {
    Warn(":malformed Can't set font on node ".Stringify($node)); }}

sub getNodeFont {
  my($self,$node)=@_;
  my $t =  $node->nodeType;
  (($t == XML_ELEMENT_NODE) && $$self{node_fonts}{$node->getAttribute('_font')})
    || LaTeXML::Font->default(); }

#**********************************************************************
# absorb a given object into the DOM.
sub absorb {
  my($self,$box)=@_;
  if(!defined $box){}
  elsif(ref $box){
    local $LaTeXML::BOX = $box;
    $box->beAbsorbed($self); }
  # The following handle inserting raw strings, presumably within the context of some constructor?
  elsif(!$LaTeXML::BOX->isMath){
    $self->openText_internal($box); }
  # Note that in math mode text nodes appear ONLY in <XMTok> or <text>!!!
  elsif($$self{model}->getNodeQName($$self{node}) eq $MATH_TOKEN_NAME){ # Already in a XMTok, just insert the text
    print STDERR "Appending text \"$box\" to $MATH_TOKEN_NAME ".Stringify($$self{node})."\n"
      if $LaTeXML::Document::DEBUG;
#    $$self{node}->appendText($box); 
    $self->openMathText_internal($box); }
  else {			# Shouldn't happen?  Should I distinguish space from `real' stuff?
    # Odd case: constructors that work in math & text can insert raw strings in Math mode.
    $self->insertMathToken($box,font=>$LaTeXML::BOX->getFont); }}

sub absorbText {
  my($self,$string,$font)=@_;
  if(!$LaTeXML::BOX->isMath){
    $self->openText($string,$font); }
  # Note that in math mode text nodes appear ONLY in <XMTok> or <text>!!!
  # DO we have to worry about matching the font???
  elsif($$self{model}->getNodeQName($$self{node}) eq $MATH_TOKEN_NAME){ # Already in a XMTok, just insert the text
    print STDERR "Appending text \"$string\" to $MATH_TOKEN_NAME ".Stringify($$self{node})."\n"
      if $LaTeXML::Document::DEBUG;
    $self->openMathText_internal($string); }
  else {			# Shouldn't happen?  Should I distinguish space from `real' stuff?
    # Odd case: constructors that work in math & text can insert raw strings in Math mode.
    $self->insertMathToken($string,font=>$font); }}

#**********************************************************************
# Low level internal interface
sub openText_internal {
  my($self,$text)=@_;
  my $qname;
  if($$self{node}->nodeType == XML_TEXT_NODE){ # current node already is a text node.
    print STDERR "Appending text \"$text\" to ".Stringify($$self{node})."\n"  if $LaTeXML::Document::DEBUG;
    $$self{node}->appendData($text); }
  elsif(($text =~/\S/)					# If non space
	|| $$self{model}->canContain($$self{node},'#PCDATA')){ # or text allowed here
    my $point = $self->find_insertion_point('#PCDATA');
    my $node = $$self{document}->createTextNode($text);
    print STDERR "Inserting text node for \"$text\" into ".Stringify($point)."\n"
       if $LaTeXML::Document::DEBUG;
    $point->appendChild($node);
    $$self{node} = $node; }}

# Find the node where an element with qualified name $qname can be inserted.
# This will move up the tree (closing auto-closable elements),
# or down (inserting auto-openable elements), as needed.
sub find_insertion_point {
  my($self,$qname)=@_;
  $self->closeText_internal;	# Close any current text node.
  my $cur_qname = $$self{model}->getNodeQName($$self{node});
  my $inter;
  # If $qname is allowed at the current point, we're done.
  if($$self{model}->canContain($cur_qname,$qname)){
    $$self{node}; }
  # Else, if we can create an intermediate node that accepts $qname, we'll do that.
  elsif(($inter = $$self{model}->canContainIndirect($cur_qname,$qname))
	&& ($inter ne $qname) && ($inter ne $cur_qname)){
    $self->openElement($inter, font=>$self->getNodeFont($$self{node}));
    $self->find_insertion_point($qname); } # And retry insertion (should work now).
  else {			# Now we're getting more desparate...
    # Check if we can auto close some nodes, and _then_ insert the $qname.
    my ($node,$closeto) = ($$self{node});
    while(($node->nodeType != XML_DOCUMENT_NODE)
	  && $$self{model}->canAutoClose($node) && !$node->getAttribute('_noautoclose')){
      my $parent = $node->parentNode;
      if($$self{model}->canContainSomehow($parent,$qname)){
	$closeto=$node; last; }
      $node = $parent; }
    if($closeto){
      $self->closeNode_internal($closeto); # Close the auto closeable nodes.
      $self->find_insertion_point($qname); }	    # Then retry, possibly w/auto open's
    else {					    # Didn't find a legit place.
      Error(":malformed:$qname ".($qname eq '#PCDATA' ? $qname : '<'.$qname.'>')." isn't allowed in ".Stringify($$self{node}));
      $$self{node}; }}}	# But we'll do it anyway, unless Error => Fatal.

# Closing a text node is a good time to apply regexps (aka. Ligatures)
sub closeText_internal {
  my($self)=@_;
  my $node = $$self{node};
  if($node->nodeType == XML_TEXT_NODE){ # Current node is text?
    my $parent  = $node->parentNode; 
    my $font = $self->getNodeFont($parent);
    my $string = $node->data;
    my $ostring = $string;
    my $fonttest;
    foreach my $ligature ($STATE->getModel->getLigatures){
      next if ($fonttest = $$ligature{fontTest}) && !&$fonttest($font);
      $string =~ &{$$ligature{code}}($string); }
    $node->setData($string) unless $string eq $ostring;
    $$self{node}=$parent;	# Now, effectively Closed
    $parent; }
  else {
    $node; }}
  
# Close $node, and any current nodes below it.
# No checking! Use this when you've already verified that $node can be closed.
# and, of course, $node must be current or some ancestor of it!!!
sub closeNode_internal {
  my($self,$node)=@_;
  my $closeto = $node->parentNode; # Grab now in case afterClose screws the structure.
  my $n = $self->closeText_internal; # Close any open text node.
  while($n->nodeType == XML_ELEMENT_NODE){
    if(my $post= $$self{model}->getTagProperty($n,'afterClose')){
      map(&$_($self,$n,$LaTeXML::BOX),@$post); }
    last if $$node eq $$n;	# NOTE: This equality test is questionable
    $n = $n->parentNode; }
  print STDERR "Closing ".Stringify($node)." => ".Stringify($closeto)."\n" if $LaTeXML::Document::DEBUG;

  $$self{node} = $closeto;

  my @c;
  # If we're closing a node that can take font switches and it contains a single FONT_ELEMENT_NAME node; pull it up.
  my $np = $node->parentNode;
  if(($$closeto eq $$np)	# node is Still in tree!
     && (scalar(@c=$node->childNodes) == 1) # with single child
     && ($$self{model}->getNodeQName($c[0]) eq $FONT_ELEMENT_NAME)
     && $$self{model}->canHaveAttribute($node,'font')){
    my $c = $c[0];
    $self->setNodeFont($node,$self->getNodeFont($c));
    $node->removeChild($c);
    foreach my $gc ($c->childNodes){
      $node->appendChild($gc); }
    foreach my $attr ($c->attributes()){
      if($attr->nodeType == XML_ATTRIBUTE_NODE){
	my $key = $attr->nodeName;
	my $val = $attr->getValue;
	if($key eq 'xml:id'){	# Use the replacement id
	  if(!$node->hasAttribute($key)){
	    $self->recordID($val,$node);
	    $node->setAttribute($key, $val); }}
	elsif($key eq 'class'){
	  if(my $class = $node->getAttribute($key)){
	    $node->setAttribute($key,$class.' '.$val); }
	  else {
	    $node->setAttribute($key,$class); }}
	elsif(my $ns = $attr->namespaceURI){
	  $node->setAttributeNS($ns,$attr->localname,$val); }
	else {
	  $node->setAttribute( $attr->localname,$val); }}}
    }
  $$self{node}; }

sub getInsertionCandidates {
  my($node)=@_;
  my @nodes = ();
  # Check the current element FIRST, then build list of candidates.
  my $first = $node;
  $first = $first->parentNode if $first && $first->getType == XML_TEXT_NODE;
  my $isCapture = $first && ($first->localname||'') eq '_Capture_';
  push(@nodes,$first) if $first && $first->getType != XML_DOCUMENT_NODE && !$isCapture;
  $node = $node->lastChild if $node && $node->hasChildNodes;
  while($node && ($node->nodeType != XML_DOCUMENT_NODE)){
    my $n = $node;
    while($n){
      if(($n->localname || '') eq '_Capture_'){
	push(@nodes,element_nodes($n)); }
      else {
	push(@nodes,$n); }
      $n = $n->previousSibling; }
    $node = $node->parentNode; }
  push(@nodes,$first) if $isCapture;
  @nodes; }

# The following two "floatTo" operations find an appropriate point
# within the document tree preceding the current insertion point.
# They return undef (& issue a warning) if such a point cannot be found.
# Otherwise, they move the current insertion point to the appropriate node,
# and return the previous insertion point.
# After you make whatever changes (insertions or whatever) to the tree,
# you should do
#   $document->setNode($savenode)
# to reset the insertion point to where it had been.

# Find a node in the document that can contain an element $qname
sub floatToElement {
  my($self,$qname)=@_;
  my @candidates = getInsertionCandidates($$self{node});
  while(@candidates && ! $$self{model}->canContain($candidates[0],$qname)){
    shift(@candidates); }
  if(my $n = shift(@candidates)){
    my $savenode = $$self{node};
    $$self{node}=$n;
    print STDERR "Floating from ".Stringify($savenode)." to ".Stringify($n)." for $qname\n" 
	if ($$savenode ne $$n) && $LaTeXML::Document::DEBUG;
   $savenode; }
  else { 
    Warn(":malformed No open node can accept <$qname> at ".Stringify($$self{node}))
      unless $$self{model}->canContainSomehow($$self{node},$qname);
    undef; }}

# Find a node in the document that can accept the attribute $key
sub floatToAttribute {
  my($self,$key)=@_;
  my @candidates = getInsertionCandidates($$self{node});
  while(@candidates && ! $$self{model}->canHaveAttribute($candidates[0],$key)){
    shift(@candidates); }
  if(my $n = shift(@candidates)){
    my $savenode = $$self{node};
    $$self{node}=$n;
    $savenode; }
  else {
    Warn(":malformed No open node can get attribute \"$key\"");
    undef; }}

# Add the given attribute to the nearest node that is allowed to have it.
sub addAttribute {
  my($self,$key,$value)=@_;
  return unless defined $value;
  my $node = $$self{node};
  $node = $node->parentNode if $node->nodeType == XML_TEXT_NODE;
  while(($node->nodeType != XML_DOCUMENT_NODE) && ! $$self{model}->canHaveAttribute($node,$key)){
    $node = $node->parentNode; }
  if($node->nodeType == XML_DOCUMENT_NODE){
    Error(":malformed Attribute $key (=>$value) not allowed in ".Stringify($$self{node})." or ancestors"); }
  else {
    $self->setAttribute($node,$key,$value); }}

#**********************************************************************
# Middle level, mostly public, API.
# Handlers for various construction operations.
# General naming: 'open' opens a node at current pos and sets it to current,
# 'close' closes current node(s), inserts opens & closes, ie. w/o moving current


# Tricky: Insert some text in a particular font.
# We need to find the current effective -- being the closest  _declared_ font,
# (ie. it will appear in the elements attributes).  We may also want
# to open/close some elements in such a way as to minimize the font switchiness.
# I guess we should only open/close "text" elements, though.
# [Actually, we'd like the user to _declare_ what element to use....
#  I don't like having "text" built in here!
#  AND, we've assumed that "font" names the relevant attribute!!!]

sub openText {
  my($self,$text,$font)=@_;
  my $node = $$self{node};
  my $t = $node->nodeType;
  return if $text=~/^\s+$/ && 
    (($t == XML_DOCUMENT_NODE) # Ignore initial whitespace
     || (($t == XML_ELEMENT_NODE) && !$$self{model}->canContain($node,'#PCDATA')));
  print STDERR "Insert text \"$text\" /".Stringify($font)." at ".Stringify($node)."\n"
    if $LaTeXML::Document::DEBUG;

  if(($t != XML_DOCUMENT_NODE) # If not at document begin
     && !(($t == XML_TEXT_NODE) && # And not appending text in same font.
	  ($font->distance($self->getNodeFont($node->parentNode))==0))){
    # then we'll need to do some open/close to get fonts matched.
    $node = $self->closeText_internal; # Close text node, if any.
    my ($bestdiff,$closeto)=(99999,$node);
    my $n = $node;
    while($n->nodeType != XML_DOCUMENT_NODE){
      my $d = $font->distance($self->getNodeFont($n));
#print STDERR "Font Compare: ".Stringify($n)." w/font=".Stringify($self->getNodeFont($n))." ==>$d\n";

      if($d < $bestdiff){
	$bestdiff = $d;
	$closeto = $n;
	last if ($d == 0); }
      last unless ($$self{model}->getNodeQName($n) eq $FONT_ELEMENT_NAME) && !$n->getAttribute('_noautoclose');
      $n = $n->parentNode; }
    $$self{node} = $closeto if $closeto ne $node;	# Move to best starting point for this text.
    $self->openElement($FONT_ELEMENT_NAME,font=>$font,_fontswitch=>1) if $bestdiff > 0; # Open if needed.
  }
  # Finally, insert the darned text.
  $self->openText_internal($text); }

sub insertMathToken {
  my($self,$string,%attributes)=@_;
  $attributes{role}='UNKNOWN' unless $attributes{role};
  my $node = $self->openElement($MATH_TOKEN_NAME, %attributes);
  my $font = $attributes{font} || $LaTeXML::BOX->getFont;
  $self->setNodeFont($node,$font);
  $self->setNodeBox($node,$LaTeXML::BOX);
  $self->openMathText_internal($string);
  $self->closeNode_internal($node);  # Should be safe.
  $node; }

sub openMathText_internal {
  my($self,$string)=@_;
  # And if there's already text???
  my $node = $$self{node};
  my $font = $self->getNodeFont($node);
  $node->appendText($string);
##print STDERR "Trying Math Ligatures at \"$string\"\n";
  my @sibs = $node->parentNode->childNodes;
  foreach my $ligature ($STATE->getModel->getMathLigatures){
    my($nmatched, $newstring, %attr) = &{$$ligature{matcher}}($self,@sibs);
    if($nmatched){
##      print STDERR "Matched $nmatched => \"$newstring\"\n";
      my @boxes = ($self->getNodeBox($node));
      $node->firstChild->setData($newstring);
      for(my $i=0; $i<$nmatched-1; $i++){
	my $remove = $node->previousSibling;
	unshift(@boxes,$self->getNodeBox($remove));
	$node->parentNode->removeChild($remove); }
## This fragment replaces the node's box by the composite boxes it replaces
## HOWEVER, this gets things out of sync because parent lists of boxes still
## have the old ones.  Unless we could recursively replace all of them, we'd better skip it(??)
##    if(scalar(@boxes) > 1){
##	$self->setNodeBox($node,LaTeXML::MathList->new(@boxes)); }
      foreach my $key (keys %attr){
	my $value = $attr{$key};
	if(defined $value){
	  $node->setAttribute($key=>$value); }
	else {
	  $node->removeAttribute($key); }}
      last; }}			# Hmm.. last? Or restart matches?
  $node;}

# Mystery:
#  How to deal with font declarations?
#  font vs _font; either must redirect to Font object until they are relativized, at end.
#  When relativizing, should it depend on font attribute on element and/or DTD allowed attribute?
sub openElement {
  my($self,$qname,%attributes)=@_;
  NoteProgress('.') if ($$self{progress}++ % 25)==0;
  print STDERR "Open element $qname at ".Stringify($$self{node})."\n" if $LaTeXML::Document::DEBUG;
  my $point = $self->find_insertion_point($qname);
  my($ns,$tag) = $$self{model}->decodeQName($qname);
  my $node;
  if($point->nodeType == XML_DOCUMENT_NODE){ # First node! (?)
    $$self{model}->addSchemaDeclaration($self,$tag);
    map( $$self{document}->appendChild($_), @{$$self{pending}}); # Add saved comments, PI's
    $node = $$self{document}->createElement($tag);
    $$self{document}->setDocumentElement($node); 
    if($ns){
      # Here, we're creating the initial, document elemnt, which will hold ALL of the namespace declarations.
      # If there is a default namespace (no prefix), that will also be declared, and applied here.
      # However, if there is ALSO a prefix associated with that namespace, we have to declare it FIRST
      # due to the (apparently) buggy way that XML::LibXML works with namespaces in setAttributeNS.
      my $prefix = $$self{model}->getDocumentNamespacePrefix($ns);
      my $attprefix = $$self{model}->getDocumentNamespacePrefix($ns,1,1);
      if(!$prefix && $attprefix){
	$node->setNamespace($ns,$attprefix, 0); }
      $node->setNamespace($ns,$prefix, 1); }}
  else {
    if($ns){
      if(! defined $point->lookupNamespacePrefix($ns)){	# namespace not already declared?
	$self->getDocument->documentElement
	  ->setNamespace($ns,$$self{model}->getDocumentNamespacePrefix($ns),0); }
      $node = $point->addNewChild($ns,$tag); }
    else {
      $node = $point->appendChild($$self{document}->createElement($tag)); }}

  foreach my $key (sort keys %attributes){
    next if $key eq 'font';	# !!!
    next if $key eq 'locator';	# !!!
    $self->setAttribute($node,$key,$attributes{$key}); }

   $self->setNodeFont($node, $attributes{font}||$LaTeXML::BOX->getFont);
  $self->setNodeBox($node, $LaTeXML::BOX);
  print STDERR "Inserting ".Stringify($node)." into ".Stringify($point)."\n" if $LaTeXML::Document::DEBUG;
  $$self{node} = $node;
  if(defined(my $post=$$self{model}->getTagProperty($node,'afterOpen'))){
    map( &$_($self,$node,$LaTeXML::BOX), @$post); }
  $$self{node}; }

sub closeElement {
  my($self,$qname)=@_;
  print STDERR "Close element $qname at ".Stringify($$self{node})."\n" if $LaTeXML::Document::DEBUG;
  $self->closeText_internal();
  my ($node, @cant_close) = ($$self{node});
  while($node->nodeType != XML_DOCUMENT_NODE){
    my $t = $$self{model}->getNodeQName($node);
    # autoclose until node of same name BUT also close nodes opened' for font switches!
    last if ($t eq $qname) && !( ($t eq $FONT_ELEMENT_NAME) && $node->getAttribute('_fontswitch'));
    push(@cant_close,$t) unless $$self{model}->canAutoClose($node) && !$node->getAttribute('_noautoclose');
    $node = $node->parentNode; }
  if($node->nodeType == XML_DOCUMENT_NODE){ # Didn't find $qname at all!!
    Error(":malformed Attempt to close ".($qname eq '#PCDATA' ? $qname : '</'.$qname.'>').", which isn't open; in ".$self->getNodePath); }
  else {			# Found node.
    # Intervening non-auto-closeable nodes!!
    Error(":malformed Closing ".($qname eq '#PCDATA' ? $qname : '</'.$qname.'>')." whose open descendents (".
	  join(', ',map(Stringify($_),@cant_close)).") dont auto-close")
      if @cant_close;
    # So, now close up to the desired node.
    $self->closeNode_internal($node);
    $node; }}

# Check whether it is possible to open $qname at this point,
# possibly by autoOpen'ing & autoClosing other tags.
sub isOpenable {
  my($self,$qname)=@_;
  my $model = $$self{model};
  my $node = $$self{node};
  while($node){
    return 1 if $model->canContainSomehow($node,$qname);
    return 0 unless $model->canAutoClose($model->getNodeQName($node))
      && (($node->nodeType != XML_ELEMENT_NODE) || !$node->getAttribute('_noautoclose'));
    $node = $node->parentNode; }
  return 0; }
#  $$self{model}->canContainSomehow($$self{node},$qname); }

# Check whether it is possible to close each element in @tags,
# any intervening nodes must be autocloseable.
# returning the last node that would be closed if it is possible,
# otherwise undef.
sub isCloseable {
  my($self,@tags)=@_;
  my $node = $$self{node};
  $node = $node->parentNode if $node->nodeType == XML_TEXT_NODE;
  while(my $qname = shift(@tags)){
    while(1){
      return if $node->nodeType == XML_DOCUMENT_NODE;
      my $this_qname = $$self{model}->getNodeQName($node);
      last if $this_qname eq $qname;
      return unless $$self{model}->canAutoClose($this_qname) && !$node->getAttribute('_noautoclose');
      $node = $node->parentNode; }
    $node = $node->parentNode if @tags; }
  $node; }

# Close $qname, if it is closeable.
sub maybeCloseElement {
  my($self,$qname)=@_;
  if(my $node = $self->isCloseable($qname)){
    $self->closeNode_internal($node);
    $node; }}

# Shorthand for open,absorb,close, but returns the new node.
sub insertElement {
  my($self,$qname,$content,%attrib)=@_;
  my $node = $self->openElement($qname,%attrib);
  if(ref $content eq 'ARRAY'){
    map($self->absorb($_), @$content); }
  elsif(defined $content){
    $self->absorb($content); }
  $self->closeElement($qname); 
  $node; }

# Set an attribute on a node, decoding the prefix, if any.
# Also records, and checks, any id attributes.
# We _could_ check whether attribute is even allowed here? NOT YET.
sub setAttribute {
  my($self,$node,$key,$value)=@_;
  $value = ToString($value) if ref $value;
# not completely safe...
#######  $value =~ s/^\{(.*)\}$/$1/ if $value;	 # Strip outer {}
  if((defined $value) && ($value ne '')){ # Skip if `empty'; but 0 is OK!
    $value = $self->recordID($value,$node) if $key eq 'xml:id'; # If this is an ID attribute
    my($ns,$name)=$$self{model}->decodeQName($key);
# Odd; the $name must be a $QName!!! ???
#    ($ns ? $node->setAttributeNS($ns,$name=>$value) : $node->setAttribute($name=>$value)); }}

    if($ns){
      my $prefix = $$self{model}->getDocumentNamespacePrefix($ns,1);
      if(! $node->lookupNamespacePrefix($ns)){	# namespace not already declared? (but must have SOME prefix!!!)
	$self->getDocument->documentElement->setNamespace($ns,$prefix,0); }
      my $qname = ($prefix && $prefix ne '#default' ? "$prefix:$name" : $name);
      $node->setAttributeNS($ns,$qname=>$value); }
    else {
      $node->setAttribute($name=>$value); }}}

# Insert a new comment, or append to previous comment.
# Does NOT move the current insertion point to the Comment,
# but may move up past a text node.
sub insertComment {
  my($self,$text)=@_;
  chomp($text);
  $text =~ s/\-\-+/__/g;
  $self->closeText_internal;	# Close any open text node.
  my $comment;
  if($$self{node}->nodeType == XML_DOCUMENT_NODE){
    push(@{$$self{pending}}, $comment = $$self{document}->createComment(' '.$text.' ')); }
  elsif(($comment = $$self{node}->lastChild) && ($comment->nodeType == XML_COMMENT_NODE)){
    $comment->setData($comment->data."\n     ".$text); }
  else {
    $comment = $$self{node}->appendChild($$self{document}->createComment(' '.$text.' ')); }
  $comment; }

# Insert a ProcessingInstruction of the form <?op attr=value ...?>
# Does NOT move the current insertion point to the PI,
# but may move up past a text node.
sub insertPI {
  my($self,$op,%attrib)=@_;
  # We'll just put these on the document itself.
  my $data = join(' ',map($_."=\"".ToString($attrib{$_})."\"",keys %attrib));
  my $pi = $$self{document}->createProcessingInstruction($op,$data);
  $self->closeText_internal;	# Close any open text node
  if($$self{node}->nodeType == XML_DOCUMENT_NODE){
    push(@{$$self{pending}}, $pi); }
  else {
    $$self{node}->appendChild($pi); }
  $pi; }

#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
# Document surgery (?)
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
# moving stuff around, duplicating, etc.

#**********************************************************************
# Appending clones of nodes

# Inserting clones of nodes into the document.
# Nodes that exist in some other part of the document (or some other document)
# will need to be cloned so that they can be part of the new document;
# otherwise, they would be removed from thier previous document.
# Also, we want to have a clean namespace node structure
# (otherwise, libxml2 has a tendency to introduce annoying "default" namespace prefix declarations)
# And, finally, we need to modify any id's present in the old nodes,
# since otherwise they may be duplicated.

# [note: this incorporates XML::append_nodes_clone and LaTeX.pool's cloneMath
# it's likely that both of those should become obsolete!]
# Should have variants here for prepend, insert before, insert after.... ???
sub appendClone {
  my($self,$node,@newchildren)=@_;
  # Expand any document fragments
  @newchildren = map( ($_->nodeType == XML_DOCUMENT_FRAG_NODE ? $_->childNodes : $_), @newchildren);
  # Now find all xml:id's in the newchildren and record replacement id's for them
  local %LaTeXML::Document::IDMAP=();
  # Find all id's defined in the copy and change the id.
  foreach my $child (@newchildren){
    foreach my $idnode ($self->findnodes('.//@xml:id',$child)){
      my $id = $idnode->getValue;
      $LaTeXML::Document::IDMAP{$id}=$self->modifyID($id); }}
  # Now do the cloning (actually copying) and insertion.
  $self->appendClone_aux($node,@newchildren);
  $node; }

sub appendClone_aux {
  my($self,$node,@newchildren)=@_;
  foreach my $child (@newchildren){
    my $type = $child->nodeType;
    if($type == XML_ELEMENT_NODE){
      my $new = $node->addNewChild($child->namespaceURI,$child->localname);
      foreach my $attr ($child->attributes){
	if($attr->nodeType == XML_ATTRIBUTE_NODE){
	  my $key = $attr->nodeName;
	  if($key eq 'xml:id'){	# Use the replacement id
	    my $newid = $LaTeXML::Document::IDMAP{$attr->getValue};
	    $new->setAttribute($key, $newid);
	    $self->recordID($newid,$new); }
	  elsif($key eq 'idref'){ # Refer to the replacement id if it was replaced
	    my $id = $attr->getValue;
	    $new->setAttribute($key, $LaTeXML::Document::IDMAP{$id} || $id);}
	  elsif(my $ns = $attr->namespaceURI){
	    $new->setAttributeNS($ns,$attr->localname,$attr->getValue); }
	  else {
	    $new->setAttribute( $attr->localname,$attr->getValue); }}
      }
      $self->appendClone_aux($new, $child->childNodes); }
    elsif($type == XML_TEXT_NODE){
      $node->appendTextNode($child->textContent); }}
  $node; }

#**********************************************************************
# Wrapping & Unwrapping nodes by another element.

# Wrap @nodes with an element named $qname, making the new element replace the first $node,
# and all @nodes becomes the child of the new node.
# [this makes most sense if @nodes are a sequence of siblings]
# Returns undef if $qname isn't allowed in the parent, or if @nodes aren't allowed in $qname,
# otherwise, returns the newly created $qname.
sub wrapNodes {
  my($self,$qname, @nodes)=@_;
  return unless @nodes;
  my $model = $$self{model};
  my $parent = $nodes[0]->parentNode;
  return unless $model->canContain($model->getNodeQName($parent),$qname)
    && ! grep( ! $model->canContain($qname,$model->getNodeQName($_)), @nodes);
  my($ns,$tag) = $model->decodeQName($qname);
  my $new;
  if($ns){
    if(! defined $parent->lookupNamespacePrefix($ns)){	# namespace not already declared?
      $self->getDocument->documentElement
	->setNamespace($ns,$model->getDocumentNamespacePrefix($ns),0); }
    $new= $parent->addNewChild($ns,$tag); }
  else {
    $new = $parent->appendChild($$self{document}->createElement($tag)); }
  $parent->replaceChild($new,$nodes[0]);
  foreach my $node (@nodes){
    $new->appendChild($node); }
  $new; }

# Unwrap the children of $node, by replacing $node by its children.
# Returns undef if the children are not allowed in the parent,
# else returns the REMOVED node.
sub unwrapNodes {
  my($self,$node)=@_;
  my $model = $$self{model};
  my $parent = $node->parentNode;
  my $parentqname = $model->getNodeQName($parent);
  my @children = $node->childNodes;
  if( ! grep( ! $model->canContain($parentqname,$model->getNodeQName($_)), @children)){
    my $c0;
    while(my $c1 = shift(@children)){
      if($c0){ $parent->insertAfter($c1,$c0); }
      else   { $parent->replaceChild($c1,$node); }
      $c0=$c1; }
    $node; }}

#**********************************************************************
1;


__END__

=pod 

=head1 NAME

C<LaTeXML::Document> - represents an XML document under construction.

=head1 DESCRIPTION

A C<LaTeXML::Document> constructs an XML document by
absorbing the digested L<LaTeXML::List> (from a L<LaTeXML::Stomach>),
Generally, the L<LaTeXML::Box>s and L<LaTeXML::List>s create text nodes,
whereas the L<LaTeXML::Whatsit>s create C<XML> document fragments, elements
and attributes according to the defining L<LaTeXML::Constructor>.

The C<LaTeXML::Document> maintains a current insertion point for where material will
be added. The L<LaTeXML::Model>, derived from various declarations and document type, 
is consulted to determine whether an insertion is allowed and when elements may need
to be automatically opened or closed in order to carry out a given insertion.
For example, a C<subsection> element will typically be closed automatically when it
is attempted to open a C<section> element.

In the methods described here, the term C<$qname> is used for XML qualified names.
These are tag names with a namespace prefix.  The prefix should be one
registered with the current Model, for use within the code.  This prefix is
not necessarily the same as the one used in any DTD, but should be mapped
to the a Namespace URI that was registered for the DTD.

The arguments named C<$node> are an XML::LibXML node.


=head2 Accessors

=over 4

=item C<< $doc = $document->getDocument; >>

Returns the C<XML::LibXML::Document> currently being constructed.

=item C<< $node = $document->getNode; >>

Returns the node at the current insertion point during construction.  This node
is considered still to be `open'; any insertions will go into it (if possible).
The node will be an C<XML::LibXML::Element>, C<XML::LibXML::Text>
or, initially, C<XML::LibXML::Document>.

=item C<< $node = $document->getElement; >>

Returns the closest ancestor to the current insertion point that is an Element.

=item C<< $document->setNode($node); >>

Sets the current insertion point to be  C<$node>.
This should be rarely used, if at all; The construction methods of document
generally maintain the notion of insertion point automatically.
This may be useful to allow insertion into a different part of the document,
but you probably want to set the insertion point back to the previous
node, afterwards.

=back

=head2 Construction Methods

=over 4

=item C<< $document->absorb($digested); >>

Absorb the C<$digested> object into the document at the current insertion point
according to its type.  Various of the the other methods are invoked as needed,
and document nodes may be automatically opened or closed according to the document
model.

=item C<< $xmldoc = $document->finalize; >>

This method finalizes the document by cleaning up various temporary
attributes, and returns the L<XML::LibXML::Document> that was constructed.

=item C<< $document->openText($text,$font); >>

Open a text node in font C<$font>, performing any required automatic opening
and closing of intermedate nodes (including those needed for font changes)
and inserting the string C<$text> into it.

=item C<< $document->insertMathToken($string,%attributes); >>

Insert a math token (XMTok) containing the string C<$string> with the given attributes.
Useful attributes would be name, role, font.
Returns the newly inserted node.

=item C<< $document->openElement($qname,%attributes); >>

Open an element, named C<$qname> and with the given attributes.
This will be inserted into the current node while  performing 
any required automatic opening and closing of intermedate nodes.
The new element is returned, and also becomes the current insertion point.
An error (fatal if in C<Strict> mode) is signalled if there is no allowed way
to insert such an element into the current node.

=item C<< $document->closeElement($qname); >>

Close the closest open element named C<$qname> including any intermedate nodes that
may be automatically closed.  If that is not possible, signal an error.
The closed node's parent becomes the current node.
This method returns the closed node.

=item C<< $node = $document->isOpenable($qname); >>

Check whether it is possible to open a C<$qname> element
at the current insertion point.

=item C<< $node = $document->isCloseable($qname); >>

Check whether it is possible to close a C<$qname> element,
returning the node that would be closed if possible,
otherwise undef.

=item C<< $document->maybeCloseElement($qname); >>

Close a C<$qname> element, if it is possible to do so,
returns the closed node if it was found, else undef.

=item C<< $document->insertElement($qname,$content,%attributes); >>

This is a shorthand for creating an element C<$qname> (with given attributes),
absorbing C<$content> from within that new node, and then closing it.
The C<$content> must be digested material, either a single box, or
an array of boxes.  This method returns the newly created node,
although it will no longer be the current insertion point.

=item C<< $document->insertComment($text); >>

Insert, and return, a comment with the given C<$text> into the current node.

=item C<< $document->insertPI($op,%attributes); >>

Insert, and return,  a ProcessingInstruction into the current node.


=item C<< $document->addAttribute($key=>$value); >>

Add the given attribute to the nearest node that is allowed to have it.

=back

=head1 AUTHOR

Bruce Miller <bruce.miller@nist.gov>

=head1 COPYRIGHT

Public domain software, produced as part of work done by the
United States Government & not subject to copyright in the US.

=cut

