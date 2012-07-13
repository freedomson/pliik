# BUILD _SYSTEM

cd models
for dir in *
  do
    if [ "$dir" != "sequence.pic" ] 
      then
        java -jar ../lib/UmlGraph.jar -package -output - $dir/modules.java | dot -Tsvg -o ../pic/$dir.uml.svg
        pic2plot -Tsvg $dir/flow.pic >../pic/$dir.flow.svg
    fi
done
