#!/usr/bin/node --harmony


'use strict';


var fs = require('fs');


function work(filename){
    var msg_set = {};
    var keys = [];
    var file_token = ' ' + filename + ':';
    var n = 0;

    var content = fs.readFileSync(filename, {encoding: 'UTF-8'});
    var lines = content.split('\n');
    for(let line of lines){
	let match = line.match(/data-text="[^"]+"|data-title="[^"]+"/g);
	n++;
	if(!match)
	    continue;
	match = match.map(function(s){
	    return s.match(/"([^"]+)"/)[1];
	});
	for(let msgid of match){
	    if(!msg_set[msgid])
		msg_set[msgid] = [];
	    msg_set[msgid].push(n);
	}
    }

    keys = Object.keys(msg_set);
    for(let msgid of keys)
	msg_set[msgid].sort();
    keys.sort(function(a, b){
	if(msg_set[a][0] > msg_set[b][0])
	    return 1;
	if(msg_set[a][0] < msg_set[b][0])
	    return -1;
	return 0;
    });
    for(let msgid of keys){
	console.log('#:' + file_token + msg_set[msgid].join(file_token));
	console.log('msgid "'+ msgid +'"');
	console.log('msgstr ""\n');
    }
}


for(let i=2; i<process.argv.length; i++)
    work(process.argv[i]);
