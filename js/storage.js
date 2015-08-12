(function(){


const APP_NAME = require('nw.gui').App.manifest.name;
const BASE_DIR = (process.platform == 'win32')? process.env['LOCALAPPDATA'] + '/WebApp': process.env['HOME'] + '/.web_app';
const DATA_DIR = 'data';
const RECORD_FILE = 'record';
const SETTINGS_FILE = 'settings';


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


function init_storage(options){
    record_file = path(BASE_DIR, APP_NAME, RECORD_FILE);
    settings_file = path(BASE_DIR, APP_NAME, SETTINGS_FILE);
    data_dir = path(BASE_DIR, APP_NAME, DATA_DIR);
    if(options.record){
	if(!fs_ext.existsSync(record_file)){
	    fs_ext.ensureFileSync(record_file);
	    fs_ext.writeJSONFileSync(record_file, options.record);
	}else{
	    fs_ext.ensureFileSync(record_file);
	}
    }
    if(options.data)
	fs_ext.ensureDirSync(data_dir);
    if(options.settings){
	let default_settings = {};
	for(let category of options.settings){
	    /* values of items of the current category */
	    let default_values = {};
	    for(let item of category.items)
		default_values[item.name] = item.default;
	    /* category.category means name of the current category */
	    default_settings[category.category] = default_values;
	}
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


window.DataStorage = {
    init: init_storage,
    record: {
	read: read_record,
	write: write_record
    },
    data: {
	dir: data_dir
    }
};


})();
