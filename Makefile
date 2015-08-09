JS = js/layout.js js/widget.js js/i18n.js js/storage.js
CSS = css/layout.css css/widget.css


all: $(JS) $(CSS)
	cat $(JS) > subway_ui.js
	cat $(CSS) > subway_ui.css

clean:
	rm subway_ui.js
	rm subway_ui.css
