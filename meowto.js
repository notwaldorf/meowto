var MEOWTO = "__MEOWTO__";  // LocalStorage goes here
var aliases = {};

(function() {
  // Read aliases from local storage, if there are any.
  if (!localStorage[MEOWTO])
    updateLocalStorage();
  else
    aliases = JSON.parse(localStorage[MEOWTO]);

  var query = window.location.search.substring(1);

  switch(query) {
    case '':
      showList();
      showHelp();
      break;
    case 'list':
      showList();
      break;
    case 'help':
    case 'halp':
      showHelp();
      break;
    default:
      if (query.indexOf('add') == 0)
        addAlias(query);
      else if (query.indexOf('nuke') == 0)
        nukeAlias(query);
      else
        redirectTo(query);
}
})();

function showList() {
  document.getElementById('list-box').hidden = false;
  if (Object.keys(aliases).length == 0)
    document.getElementById('no-items').hidden = false;

  //<li><span class="meow">goog</span>
  //<a href="http://www.google.com">http://www.google.com</a>
}

function showError() {
  document.getElementById('error-box').hidden = false;
  showHelp();
}
function showHelp() {
  document.getElementById('help-box').hidden = false;
}

function showAdd() {
  document.getElementById('add-box').hidden = false;
}

function queryWithoutCommand(query, command) {
  var cleanQuery = decodeURIComponent(query.trim());

  if (cleanQuery.indexOf(command) != 0)
    return ''
  return cleanQuery.substring(command.length).trim();
}

function addAlias(query) {
  // Get rid of the verb. Also lol what even, arrow.
  var cleanQuery = queryWithoutCommand(query, 'add');
  if (cleanQuery == '') {
    showError();
    return;
  }

  var parsedQuery = cleanQuery.split('->');
  var name = parsedQuery[0].trim();
  var url = parsedQuery[1].trim();

  // If there wasn't an http://, add one.
  if (url.indexOf('http') == -1)
    url = "http://" + url;

  aliases[name] = url;
  updateLocalStorage();
  showList();
}

function nukeAlias(query) {
  var cleanQuery = query.split('+')[1];
  delete localStorage[cleanQuery];
  updateLocalStorage();
  showList()
}

function redirectTo(query) {
  var url = localStorage[query];
  if (url && url != '')
    window.location.replace(url);
  else
    showAdd();
}

function updateLocalStorage() {
  localStorage[MEOWTO] = JSON.stringify(aliases);
}
