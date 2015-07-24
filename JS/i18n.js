{


let Gettext = require('node-gettext');
let fs = require('fs');
let gettext = new Gettext();


let I18N_ITEMS = [
    {
	property_get: 'text',
	property_set: 'textContent'
    },
    {
	property_get: 'title',
	property_set: 'title'
    }
];


function init_i18n(app_name){
    /* UNIX-like only now */
    let lang = process.env.LANGUAGE || process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG;
    lang = lang.replace(/\..*/, '');
    if(!lang)
	return;
    let file = printf('locale/%1/LC_MESSAGES/%2.mo', lang, app_name);
    if(fs.existsSync(file))
	gettext.addTextdomain(lang, fs.readFileSync(file));
}


function _(msgid, msgid_pl, n){
    if(msgid_pl)
	return gettext.ngettext(msgid, msgid_pl, n);
    return gettext.gettext(msgid);
}


function translateUI(){
    for(let i=0; i<I18N_ITEMS.length; i++){
	let item = I18N_ITEMS[i];
	let elements = $All(printf('[data-%1]', item.property_get));
	for(let j=0; j<elements.length; j++)
	    elements[j][item.property_set] = _(elements[j]['dataset'][item.property_get]);
    }
}


window.init_i18n = init_i18n;
window._ = _;
window.translateUI = translateUI;


}
