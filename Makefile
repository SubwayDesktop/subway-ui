JS = JS/layout.js JS/widget.js JS/i18n.js
CSS = CSS/layout.css CSS/widget.css


all: $(JS) $(CSS)
	cat $(JS) > subway_ui.js
	cat $(CSS) > subway_ui.css

clean:
	rm subway_ui.js
	rm subway_ui.css
