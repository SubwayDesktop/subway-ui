function init(){
    i18n.init();
    pl_test_0.textContent = printf(_('%1 Comment', '%1 Comments', 0), 0);
    pl_test_1.textContent = printf(_('%1 Comment', '%1 Comments', 1), 1);
    pl_test_2.textContent = printf(_('%1 Comment', '%1 Comments', 2), 2);
    hello_button.addEventListener('click', function(){
	alert(_('Hello World!'));
    });
}


window.addEventListener('load', init);
