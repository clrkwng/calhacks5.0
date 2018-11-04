class Pair{
    constructor(original, mergedSentence, similarity){
        this.original = original;
        this.mergedSentence = mergedSentence;
        this.similarity = similarity;
    }
}


function generatePairs(originalSentence, sentenceArray){
    var returnSet = [];
    for(i = 0; i < sentenceArray.length; i++){
      returnSet.push(diffString(originalSentence, sentenceArray[i]));
    }
    return returnSet;
}

function sortPairsBySimilarity(sentencePairs){
    sentencePairs.sort(function(a, b){
      console.log(a);
        console.log("a: "+a.similarity);
        console.log("b: "+b.similarity);
        return a.similarity - b.similarity;
    });
    return sentencePairs;
    // for(i=0;i<sentencePairs.length;i++){
    //     console.log(sentencePairs[i].similarity);
    // }
}

function computeSimilarity(str1, str2, del, ins){
    //console.log(typeof(str2))
    //console.log("length: " + (str1.length + str2.length));
    return (del + ins)/(str1.length + str2.length);
}
function escape(s) {
    var n = s;
    n = n.replace(/&/g, "&amp;");
    n = n.replace(/</g, "&lt;");
    n = n.replace(/>/g, "&gt;");
    n = n.replace(/"/g, "&quot;");

    return n;
}

function diffString(o, n) {
  var original = n;
  o = o.replace(/\s+$/, '');
  n = n.replace(/\s+$/, '');
  var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );
  var str = "";

  var oSpace = o.match(/\s+/g);
  if (oSpace == null) {
    oSpace = ["\n"];
  } else {
    oSpace.push("\n");
  }
  var nSpace = n.match(/\s+/g);
  if (nSpace == null) {
    nSpace = ["\n"];
  } else {
    nSpace.push("\n");
  }
  var delCount = 0;
  var insCount = 0;
  if (out.n.length == 0) {
      for (var i = 0; i < out.o.length; i++) {
        str += '<del>' + escape(out.o[i]) + oSpace[i] + "</del>";
        delCount += escape(out.o[i]);
        /* delCount += escape(out.o[n]).length + oSpace[n].length; */
      }
  } else {
    if (out.n[0].text == null) {
      for (i = 0; i < out.o.length && out.o[i].text == null; i++) {
        str += '<del>' + escape(out.o[i]) + oSpace[i] + "</del>";
        delCount += escape(out.o[i]).length;
        /* delCount += escape(out.o[n]).length + oSpace[n].length; */
      }
    }

    for ( var i = 0; i < out.n.length; i++ ) {
      if (out.n[i].text == null) {
        str += '<ins>' + escape(out.n[i]) + nSpace[i] + "</ins>";
        insCount += escape(out.n[i]).length;
        /* insCount += escape(out.o[n]).length + oSpace[n].length; */
      } else {
        var pre = "";

        for (j = out.n[i].row + 1; j < out.o.length && out.o[j].text == null; j++ ) {
          pre += '<del>' + escape(out.o[j]) + oSpace[j] + "</del>";
          delCount += escape(out.o[j]).length;
         /*  delCount += escape(out.o[n]).length + oSpace[n].length; */
        }
        str += " " + out.n[i].text + nSpace[i] + pre;
      }
    }
  }
  //console.log(str);
  console.log("computing similarity: ... " + computeSimilarity(o, n, delCount, insCount).toString());
  return new Pair(original, str, computeSimilarity(o, n, delCount, insCount));
}

function randomColor() {
    return "rgb(" + (Math.random() * 100) + "%, " + 
                    (Math.random() * 100) + "%, " + 
                    (Math.random() * 100) + "%)";
}
function diffString2( o, n ) {
  o = o.replace(/\s+$/, '');
  n = n.replace(/\s+$/, '');

  var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );

  var oSpace = o.match(/\s+/g);
  if (oSpace == null) {
    oSpace = ["\n"];
  } else {
    oSpace.push("\n");
  }
  var nSpace = n.match(/\s+/g);
  if (nSpace == null) {
    nSpace = ["\n"];
  } else {
    nSpace.push("\n");
  }

  var os = "";
  var colors = new Array();
  for (var i = 0; i < out.o.length; i++) {
      colors[i] = randomColor();

      if (out.o[i].text != null) {
          os += '<span style="background-color: ' +colors[i]+ '">' + 
                escape(out.o[i].text) + oSpace[i] + "</span>";
      } else {
          os += "<del>" + escape(out.o[i]) + oSpace[i] + "</del>";
      }
  }

  var ns = "";
  for (var i = 0; i < out.n.length; i++) {
      if (out.n[i].text != null) {
          ns += '<span style="background-color: ' +colors[out.n[i].row]+ '">' + 
                escape(out.n[i].text) + nSpace[i] + "</span>";
      } else {
          ns += "<ins>" + escape(out.n[i]) + nSpace[i] + "</ins>";
      }
  }

  return { o : os , n : ns };
}

function diff( o, n ) {
  var ns = new Object();
  var os = new Object();
  
  for ( var i = 0; i < n.length; i++ ) {
    if ( ns[ n[i] ] == null )
      ns[ n[i] ] = { rows: new Array(), o: null };
    ns[ n[i] ].rows.push( i );
  }
  
  for ( var i = 0; i < o.length; i++ ) {
    if ( os[ o[i] ] == null )
      os[ o[i] ] = { rows: new Array(), n: null };
    os[ o[i] ].rows.push( i );
  }
  
  for ( var i in ns ) {
    if ( ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1 ) {
      n[ ns[i].rows[0] ] = { text: n[ ns[i].rows[0] ], row: os[i].rows[0] };
      o[ os[i].rows[0] ] = { text: o[ os[i].rows[0] ], row: ns[i].rows[0] };
    }
  }
  
  for ( var i = 0; i < n.length - 1; i++ ) {
    if ( n[i].text != null && n[i+1].text == null && n[i].row + 1 < o.length && o[ n[i].row + 1 ].text == null && 
         n[i+1] == o[ n[i].row + 1 ] ) {
      n[i+1] = { text: n[i+1], row: n[i].row + 1 };
      o[n[i].row+1] = { text: o[n[i].row+1], row: i + 1 };
    }
  }
  
  for ( var i = n.length - 1; i > 0; i-- ) {
    if ( n[i].text != null && n[i-1].text == null && n[i].row > 0 && o[ n[i].row - 1 ].text == null && 
         n[i-1] == o[ n[i].row - 1 ] ) {
      n[i-1] = { text: n[i-1], row: n[i].row - 1 };
      o[n[i].row-1] = { text: o[n[i].row-1], row: i - 1 };
    }
  }
  
  return { o: o, n: n };
}
