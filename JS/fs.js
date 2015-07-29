(function(){


const APP_NAME = require('nw.gui').App.manifest.name;
const BASE_DIR = (process.platform == 'win32')? process.env['LOCALAPPDATA'] + '/Subway': process.env['HOME'] + '/.subway';
const DATA_DIR = BASE_DIR + '/data';
const RECORD_DIR = BASE_DIR + '/record';
const SETTINGS_DIR = BASE_DIR + '/settings';


var fs_ext = require('fs-extra');


var record_file, settings_file, data_dir;


function path(){
    var result = '';
    for(let i=0; i<arguments.length; i++){
	result += arguments[i];
	if(i != (arguments.length - 1))
	    result += '/';
    }
    return result;
}


function init_fs(options){
    record_file = path(RECORD_DIR, APP_NAME);
    settings_file = path(SETTINGS_DIR, APP_NAME);
    data_dir = path(DATA_DIR, APP_NAME);
    if(options.record)
	fs_ext.ensureFileSync(record_file);
    if(options.data)
	fs_ext.ensureDirSync(data_dir);
    let default_settings = {};
    for(let category of options.settings){
	/* values of items of the current category */
	let default_values = {};
	for(let item of category.items)
	    default_values[item.name] = item.default;
	/* category.category means name of the current category */
	default_settings[category.category] = default_values;
    }
    if(options.settings){
	if(!fs_ext.existsSync(settings_file)){
	    fs_ext.ensureFileSync(settings_file);
	    fs_ext.writeJSONFileSync(settings_file, default_settings);
	}else{
	    fs_ext.ensureFileSync(settings_file);
	}
    }
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
