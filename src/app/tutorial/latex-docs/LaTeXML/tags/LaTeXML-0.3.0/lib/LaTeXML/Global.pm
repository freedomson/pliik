# /=====================================================================\ #
# |  LaTeXML::Global                                                    | #
# | Global constants, accessors and constructors                        | #
# |=====================================================================| #
# | Part of LaTeXML:                                                    | #
# |  Public domain software, produced as part of work done by the       | #
# |  United States Government & not subject to copyright in the US.     | #
# |---------------------------------------------------------------------| #
# | Bruce Miller <bruce.miller@nist.gov>                        #_#     | #
# | http://dlmf.nist.gov/LaTeXML/                              (o o)    | #
# \=========================================================ooo==U==ooo=/ #

#======================================================================
#  This module collects all the commonly useful constants and constructors
# that other modules and package implementations are likely to need.
# This should be used in a context where presumably all the required
# LaTeXML modules that implement the various classes have already been loaded.
#
# Yes, a lot of stuff is exported, polluting your namespace.
# Thus, you use this module only if you _need_ the functionality!
#======================================================================
package LaTeXML::Global;
use strict;
use Exporter;
use XML::LibXML;
our @ISA = qw(Exporter);
our @EXPORT = ( 
	       # Global State accessors; These variables get bound by LaTeXML.pm
	       qw( *STATE *GULLET *STOMACH *MODEL),
	       # Catcode constants
	       qw( CC_ESCAPE  CC_BEGIN  CC_END     CC_MATH
		   CC_ALIGN   CC_EOL    CC_PARAM   CC_SUPER
		   CC_SUB     CC_IGNORE CC_SPACE   CC_LETTER
		   CC_OTHER   CC_ACTIVE CC_COMMENT CC_INVALID
		   CC_CS      CC_NOTEXPANDED ),
	       # Token constructors
	       qw( &T_BEGIN &T_END &T_MATH &T_ALIGN &T_PARAM &T_SUB &T_SUPER &T_SPACE 
		   &T_LETTER &T_OTHER &T_ACTIVE &T_COMMENT &T_CS
		   &Token &Tokens
		   &Tokenize &TokenizeInternal &Explode ),
	       # Number & Dimension constructors
	       qw( &Number &Dimension &MuDimension &Glue &MuGlue),
	       # Error & Progress reporting
	       qw( &NoteProgress &Fatal &Error &Warn ),
	       # And some generics
	       qw(&Stringify &ToString  &Equals)
);

#======================================================================
# Catcodes & Standard Token constructors.
#  CC_whatever names the catcode numbers
#  T_whatever creates a token with the corresponding catcode, 
#   some take a string argument, if they don't have a `standard' character.
use constant CC_ESCAPE  =>  0;
use constant CC_BEGIN   =>  1;  sub T_BEGIN()  { bless ['{',   1], 'LaTeXML::Token'; }
use constant CC_END     =>  2;  sub T_END()    { bless ['}',   2], 'LaTeXML::Token'; }
use constant CC_MATH    =>  3;  sub T_MATH()   { bless ['$',   3], 'LaTeXML::Token'; }
use constant CC_ALIGN   =>  4;  sub T_ALIGN()  { bless ['&',   4], 'LaTeXML::Token'; }
use constant CC_EOL     =>  5;
use constant CC_PARAM   =>  6;  sub T_PARAM()  { bless ['#',   6], 'LaTeXML::Token'; }
use constant CC_SUPER   =>  7;  sub T_SUPER()  { bless ['^',   7], 'LaTeXML::Token'; }
use constant CC_SUB     =>  8;  sub T_SUB()    { bless ['_',   8], 'LaTeXML::Token'; }
use constant CC_IGNORE  =>  9;
use constant CC_SPACE   => 10;  sub T_SPACE()  { bless [' ',  10], 'LaTeXML::Token'; }
use constant CC_LETTER  => 11;  sub T_LETTER   { bless [$_[0],11], 'LaTeXML::Token'; }
use constant CC_OTHER   => 12;  sub T_OTHER    { bless [$_[0],12], 'LaTeXML::Token'; }
use constant CC_ACTIVE  => 13;  sub T_ACTIVE   { bless [$_[0],13], 'LaTeXML::Token'; }
use constant CC_COMMENT => 14;  sub T_COMMENT  { bless ['%'.($_[0]||''),14], 'LaTeXML::Token'; }
use constant CC_INVALID => 15;  
# Extended Catcodes for expanded output.
use constant CC_CS      => 16;  sub T_CS       { bless [$_[0],16], 'LaTeXML::Token'; }
use constant CC_NOTEXPANDED => 17;

sub Token {
  my($string,$cc)=@_;
  bless [$string,(defined $cc ? $cc : CC_OTHER)], 'LaTeXML::Token'; }

#======================================================================
# These belong to Mouth, but make more sense here.

our $STD_CATTABLE;
our $STY_CATTABLE;
# Note that we are overriding $STATE, which normally contains ALL the bindings, etc.
# But, since we are just tokenizing, only the catcode bindings matter.

# Tokenize($string); Tokenizes the string using the standard cattable, returning a LaTeXML::Tokens
sub Tokenize         {
  my($string)=@_;
  $STD_CATTABLE = LaTeXML::State->new(catcodes=>'standard') unless $STD_CATTABLE;
  local $LaTeXML::STATE = $STD_CATTABLE;
  LaTeXML::Mouth->new($string)->readTokens; }

# TokenizeInternal($string); Tokenizes the string using the internal cattable, returning a LaTeXML::Tokens
sub TokenizeInternal { 
  my($string)=@_;
  $STY_CATTABLE = LaTeXML::State->new(catcodes=>'style') unless  $STY_CATTABLE;
  local $LaTeXML::STATE = $STY_CATTABLE;
  LaTeXML::Mouth->new($string)->readTokens; }

#======================================================================
# Token List constructors.

# Return a LaTeXML::Tokens made from the arguments (tokens)
sub Tokens {
  map( ((ref $_) && $_->isaToken)|| Fatal("Expected Token, got ".Stringify($_)), @_);
  LaTeXML::Tokens->new(@_); }

# Explode a string into a list of tokens w/catcode OTHER (except space).
sub Explode {
  my($string)=@_;
  map(($_ eq ' ' ? T_SPACE() : T_OTHER($_)),split('',$string)); }

#======================================================================
# Constructors for number and dimension types.

sub Number      { LaTeXML::Number->new(@_); }
sub Dimension   { LaTeXML::Dimension->new(@_); }
sub MuDimension { LaTeXML::MuDimension->new(@_); }
sub Glue        { LaTeXML::Glue->new(@_); }
sub MuGlue      { LaTeXML::MuGlue->new(@_); }

#**********************************************************************
# Error & Progress reporting.


sub NoteProgress { 
  print STDERR @_ if $LaTeXML::Global::STATE->lookupValue('VERBOSITY') >= 0;
  return; }

sub Fatal { 
  my($message)=@_;
  if(!$LaTeXML::Error::InHandler && defined($^S)){
    $message
      = LaTeXML::Error::generateMessage("Fatal",$message,1,
		       ($LaTeXML::Global::STATE->lookupValue('VERBOSITY') > 0
			? ("Stack Trace:",LaTeXML::Error::stacktrace()):()));
  }
  local $LaTeXML::Error::InHandler=1;
  die $message; 
  return; }

# Should be fatal if strict is set, else warn.
sub Error {
  my($msg)=@_;
  if($LaTeXML::Global::STATE->lookupValue('STRICT')){
    Fatal($msg); }
  else {
    print STDERR LaTeXML::Error::generateMessage("Error",$msg,1,"Continuing... Expect trouble.\n")
      unless $LaTeXML::Global::STATE->lookupValue('VERBOSITY') < -1; }
  return; }

sub Warn {
  my($msg)=@_;
  print STDERR LaTeXML::Error::generateMessage("Warning",$msg,0)
    unless $LaTeXML::Global::STATE->lookupValue('VERBOSITY') < 0; 
  return; }

#**********************************************************************
# Generic functions
our %NOBLESS= map(($_=>1), qw( SCALAR HASH ARRAY CODE REF GLOB LVALUE));

sub Stringify {
  my($object)=@_;
  if(!defined $object){ 'undef'; }
  elsif(!ref $object){ $object; }
  elsif($NOBLESS{ref $object}){ "$object"; }
  elsif($object->can('stringify')){ $object->stringify; }
  # Have to handle LibXML stuff explicitly (unless we want to add methods...?)
  elsif($object->isa('XML::LibXML::Node')){
    if($object->nodeType == XML_ELEMENT_NODE){ 
#      "$object"."[".$object->nodeName."]";
      my $attributes ='';
      foreach my $attr ($object->attributes){
	my $name = $attr->nodeName;
	next if $name =~ /^_/;
	$attributes .= ' '. $name. "=\"".$attr->getValue; }
      "<".$object->nodeName.$attributes.">";
    }
    else { "$object"; }}
  else { "$object"; }}
#  (defined $object ? (((ref $object) && !$NOBLESS{ref $object}) && $object->can('stringify') ? $object->stringify : "$object")
#   : 'undef'); }

sub ToString {
  my($object)=@_;
  (defined $object ? (((ref $object) && !$NOBLESS{ref $object}) ? $object->toString : "$object"):''); }

sub Equals {
  my($a,$b)=@_;
  (defined $a) && (defined $b)
    && ( ((ref $a) && (ref $b) && ((ref $a) eq (ref $b)) && !$NOBLESS{ref $a})
	 ? $a->equals($b) : ($a eq $b)); }

#**********************************************************************
1;

__END__

=pod 

=head1 NAME

C<LaTeXML::Global> -- global exports used within LaTeXML, and in Packages.

=head1 SYNOPSIS

use LaTeXML::Global;

=head1 DESCRIPTION

This module exports the various constants and constructors that are useful
throughout LaTeXML, and in Package implementations.

=head2 Global state

=over 4

=item C<< $STATE, $GULLET, $STOMACH, $MODEL; >>

These are bound to the currently active L<LaTeXML::State>, L<LaTeXML::Gullet>, L<LaTeXML::Stomach>
and L<LaTeXML::Model> by an instance of L<LaTeXML> during processing.

=back 

=head2 Tokens

=over 4

=item C<< $catcode = CC_ESCAPE; >>

A constant for the escape category code; and also:
C<CC_BEGIN>, C<CC_END>, C<CC_MATH>, C<CC_ALIGN>, C<CC_EOL>, C<CC_PARAM>, C<CC_SUPER>,
C<CC_SUB>, C<CC_IGNORE>, C<CC_SPACE>, C<CC_LETTER>, C<CC_OTHER>, C<CC_ACTIVE>, C<CC_COMMENT>, 
C<CC_INVALID>, C<CC_CS>, C<CC_NOTEXPANDED>.  [The last 2 are (apparent) extensions, 
with catcodes 16 and 17, respectively].

=item C<< $token = Token($string,$cc); >>

Creates a L<LaTeXML::Token> with the given content and catcode.  The following shorthand versions
are also exported for convenience:
C<T_BEGIN>, C<T_END>, C<T_MATH>, C<T_ALIGN>, C<T_PARAM>, C<T_SUB>, C<T_SUPER>, C<T_SPACE>, 
C<T_LETTER($letter)>, C<T_OTHER($char)>, C<T_ACTIVE($char)>, C<T_COMMENT($comment)>, C<T_CS($cs)>

=item C<< $tokens = Tokens(@token); >>

Creates a L<LaTeXML::Tokens> from a list of L<LaTeXML::Token>'s

=item C<< $tokens = Tokenize($string); >>

Tokenizes the C<$string> according to the standard cattable, returning a L<LaTeXML::Tokens>.

=item C<< $tokens = TokenizeInternal($string); >>

Tokenizes the C<$string> according to the internal cattable (where @ is a letter),
returning a L<LaTeXML::Tokens>.

=item C<< @tokens = Explode($string); >>

Returns a list of the tokens corresponding to the characters in C<$string>.

=back

=head2 Numbers, etc.

=over 4

=item C<< $number = Number($num); >>

Creates a Number object representing C<$num>.

=item C<< $dimension = Dimension($dim); >>

Creates a Dimension object.  C<$num> can be a string with the number and units
(with any of the usual TeX recognized units), or just a number standing for
scaled points (sp).

=item C<< $mudimension = MuDimension($dim); >>

Creates a MuDimension object; similar to Dimension.

=item C<< $glue = Glue($gluespec); >>

=item C<< $glue = Glue($sp,$plus,$pfill,$minus,$mfill); >>

Creates a Glue object.  C<$gluespec> can be a string in the
form that TeX recognizes (number units optional plus and minus parts).
Alternatively, the dimension, plus and minus parts can be given separately:
C<$pfill> and C<$mfill> are 0 (when the C<$plus> or C<$minus> part is in sp)
or 1,2,3 for fil, fill or filll.

=item C<< $glue = MuGlue($gluespec); >>

=item C<< $glue = MuGlue($sp,$plus,$pfill,$minus,$mfill); >>

Creates a MuGlue object, similar to Glue.

=back

=head2 Error Reporting

=over 4

=item C<< Fatal($message); >>

Signals an fatal error, printing C<$message> along with some context.
In verbose mode a stack trace is printed.

=item C<< Error($message); >>

Signals an error, printing C<$message> along with some context.
If in strict mode, this is the same as Fatal().
Otherwise, it attempts to continue processing..

=item C<< Warn($message); >>

Prints a warning message along with a short indicator of
the input context, unless verbosity is quiet.

=item C<< NoteProgress($message); >>

Prints C<$message> unless the verbosity level below 0.

=back

=head2 Generic functions

=over 4

=item C<< Stringify($object); >>

Returns a short string identifying C<$object>, for debugging purposes.
Works on any values and objects, but invokes the stringify method on 
blessed objects.
More informative than the default perl conversion to a string.

=item C<< ToString($object); >>

Converts C<$object> to string; most useful for Tokens or Boxes where the
string content is desired.  Works on any values and objects, but invokes 
the toString method on blessed objects.

=item C<< Equals($a,$b); >>

Compares the two objects for equality.  Works on any values and objects, 
but invokes the equals method on blessed objects, which does a
deep comparison of the two objects.

=back

=head1 AUTHOR

Bruce Miller <bruce.miller@nist.gov>

=head1 COPYRIGHT

Public domain software, produced as part of work done by the
United States Government & not subject to copyright in the US.

=cut

