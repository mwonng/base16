(function() {

    var selector = document.getElementById('themeSelector');
    var defaultTheme = selector.value;
    var themeStyleTag = document.createElement('style');
    var indicator = document.querySelector('.scheme');

    themeStyleTag.type = 'text/css';
    themeStyleTag.rel = 'stylesheet';

    var css;

    function switchTheme(theme) {
        indicator.innerHTML = 'Preview: ' + theme.substr(0, theme.length - 4);
        // themeLink.disabled = true;
        // themeLink.href = './css/' + theme;
        // themeLink.disabled = false;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', './css/' + theme)
        xhr.setRequestHeader("Content-Type", "text/css");
        xhr.send(null)
        xhr.addEventListener('readystatechange', function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                css = xhr.responseText
                themeStyleTag.innerHTML = css
            }
        }, false);
    }

    switchTheme(defaultTheme);

    document.getElementsByTagName('head')[0].appendChild(themeStyleTag);

    selector.onchange = function(evt) {
        switchTheme(evt.currentTarget.value);
    };

    function copy(text) {
        var textarea = document.createElement('textarea')
        textarea.innerHTML = text
        textarea.style.width = '0px'
        textarea.style.height = '0px'
        textarea.style.padding = '0'
        textarea.style.position = 'absolute'
        textarea.style.left = '-100%'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        textarea.parentNode.removeChild(textarea)
    }

    function getCSSAsObj(css) {
        var cssObj = {}
        var lines = css.split('\n'),
            splittedLine;
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].indexOf(' { color: ') !== -1) {
                splittedLine = lines[i].split(':')
                splittedLine[0] = splittedLine[0].substr(1, 6)
                splittedLine[1] = splittedLine[1].substr(1, 7)
                cssObj[splittedLine[0]] = splittedLine[1]
            }
        }
        return cssObj
    }

    document.body.addEventListener('click', function (e) {
        if (!e.target.classList.contains('block')) {
            return
        }
        copy(getCSSAsObj(css)['base' + e.target.textContent])
    })

    document.getElementById('copy-css').addEventListener('click', function () {
        copy(css)
    })

    document.getElementById('copy-formatted-css').addEventListener('click', function () {
        var text = '', cssObj = getCSSAsObj(css), keys = Object.keys(cssObj)
        for (var i = 0; i < keys.length; i++) {
            text += '.' + keys[i] + ' { color: ' + cssObj[keys[i]] + '; }\n'
        }
        copy(text)
    })

    document.getElementById('copy-json').addEventListener('click', function () {
        copy(JSON.stringify(getCSSAsObj(css), null, 2))
    })

    document.getElementById('copy-txt').addEventListener('click', function () {
        var text = '';
        var cssObj = getCSSAsObj(css)
        var keys = Object.keys(cssObj)
        for (var i = 0; i < keys.length; i++) {
            text += keys[i] + ' ' + cssObj[keys[i]] + '\n'
        }
        copy(text)
    })




})();
