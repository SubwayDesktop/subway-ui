(function(){


const APP_NAME = require('nw.gui').App.manifest.name;
const BASE_DIR = (process.platform == 'win32')? process.env['LOCALAPPDATA'] + '/Subway': process.env['HOME'] + '/.subway';
const DATA_DIR = BASE_DIR + '/data';
const RECORD_DIR = BASE_DIR + '/record';
const SETTINGS_DIR = BASE_DIR + '/settings';


var fs_ext = require('fs-extra');


var record_file, settings_dir, data_dir;


function path(){
    var result = '';
    for(let i=0; i<arguments.length; i++){
	result += arguments[i];
	if(i != (arguments.length - 1))
	    result += '/';
    }
    return result;
}


function ensure_dir(dir){
    fs_ext.ensureDirSync(dir);
}


function ensure_file(file){
    fs_ext.ensureFileSync(file);
}


function init_fs(options){
    record_file = path(RECORD_DIR, APP_NAME);
    settings_dir = path(SETTINGS_DIR, APP_NAME);
    data_dir = path(DATA_DIR, APP_NAME);
    if(options.record)
	ensure_file(record_file);
    if(options.settings)
	ensure_dir(settings_dir);
    if(options.data)
	ensure_dir(data_dir);
}

    
function read_record(){
    return fs_ext.readJSONSync(record_file);
}


function write_record(record){
    fs_ext.writeJSONFileSync(record_file, record);
}


window.FS = {
    init: init_fs,
    record: {
	read: read_record,
	write: write_record
    },
    data: {
	dir: data_dir
    }
};


})();
