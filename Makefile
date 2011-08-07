XPI_FILES = chrome.manifest install.rdf \
	chrome/content/keepitclean.js \
	chrome/content/overlay.xul \
	chrome/content/viewsource.js \
	chrome/content/viewsource.xul \
	chrome/content/h5val.js \
	chrome/content/about.xul \
	chrome/locale/en-US/overlay.dtd \
	chrome/locale/en-US/about.dtd \
	chrome/skin/overlay.css

all: keepitclean.xpi

keepitclean.xpi: $(XPI_FILES)
	rm -f keepitclean.xpi
	zip keepitclean.xpi $(XPI_FILES)

clean:
	find . -name '*~' -print0 | xargs -0 rm -f
