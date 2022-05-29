; function AutoComplete($input, options) {

  var defaults = {
    apiRequestDelay: 300,
    enabled: true,
    events: {
      autoComplete: function (term, list) {
        console.log('autocomplete event raised.',term, list);
      }
    },
    trigger: {
      match: undefined,
      search: undefined
    }
  };

  var local = {
    settings: null
  }

  local.settings = $.extend(true, {}, defaults, options);

  var searchCache = initializeSearchCache();

  var $ajaxSync = new AjaxCallSynchronizer({
    apiRequestDelay: local.settings.apiRequestDelay,
    apiRequest: local.settings.trigger.search
  });

  this.setEnabled = function (enabled) {
    local.settings.enabled = !!enabled;
  }

  var onTextChanged = function () {
    if (local.settings.enabled) {
      var term = getTerm();
      var cache = searchCache.getSearchCache(term);

      if (cache) {
        callback(term, cache);
      } else if (term != null) {
        $ajaxSync.execute(term, callback);
      } else {
        callAutoComplete(term, []);
      }
    }
  }

  function callback(term, list) {
    var currentTerm = getTerm();
    var cache = searchCache.getSearchCache(term);

    if (term && !cache) {
      searchCache.setSearchCache(term, list);
    }

    if (currentTerm && currentTerm === term) {
      callAutoComplete(term, list);
    }
  }

  function callAutoComplete(term, list) {
    if (local.settings.events.autoComplete) {
      local.settings.events.autoComplete(term, list);
    }
  }

  function getTerm() {
    var input = getInputState();
    var preText = getFilteredString(input.preText);

    var matches = preText.match(local.settings.trigger.match);

    if (matches && matches.length > 0) {
      return matches[0];
    }

    return null;
  }

  function getInputState() {
    var text = $input.val();
    var e = $input.get(0);

    var index = e.selectionEnd;
    var result = {
      'preText': undefined,
      'postText': undefined,
      'cursorPosition': undefined
    };

    if (typeof index === 'number') {
      result.preText = text.substring(0, index);
      result.postText = text.substring(index);
      result.cursorPosition = result.preText.length;
      return result;
    }
    else if (document.selection) {
      var range = e.createTextRange();
      range.moveStart('character', 0);
      range.moveEnd('textedit');

      result.preText = range.text;
      result.postText = text.substring(index);
      result.cursorPosition = result.preText.length;
      return result;
    }

    throw 'unsupported browser.';
  }

  function getFilteredString(str) {
    var chars = '';

    for (var x = 0; x < str.length; x++) {
      if (str.substr(x, 1).charCodeAt(0) <= parseInt('06FF', 16)) {
        chars += str.substr(x, 1);
      }
    }

    return chars;
  }

  function initializeSearchCache() {
    var cache = {};

    return {
      setSearchCache: function (term, results) {
        cache[term] = results;
      },
      getSearchCache: function (term) {
        return (cache[term]) ? cache[term] : null;
      }
    }
  }

  $input.on('change keypress keydown keyup input propertychange click', onTextChanged);

}
