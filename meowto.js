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

function addAlias(query) {
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
  var cleanQuery = queryWithoutCommand(query, 'nuke');
  if (cleanQuery == '') {
    showError();
    return;
  }

  delete aliases[cleanQuery];
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

function queryWithoutCommand(query, command) {
  var cleanQuery = decodeURIComponent(query.trim());

  if (cleanQuery.indexOf(command) != 0)
    return ''
  return cleanQuery.substring(command.length).trim();
}

function showList() {
  document.getElementById('list-box').hidden = false;
  if (Object.keys(aliases).length == 0) {
    document.getElementById('no-items').hidden = false;
    return;
  }

  var ul = document.getElementById('list')

  for (var name in aliases) {
    var li = document.createElement('li');

    var span = document.createElement('span');
    span.className = "meow";
    span.innerText = name;

    var a = document.createElement('a');
    a.innerText = aliases[name];
    a.href = aliases[name];
    a.target = '_blank';

    var del = document.createElement('a');
    del.className = "meow";
    del.innerText = "x";
    del.href = "?nuke " + name;

    li.appendChild(span);
    li.appendChild(a);
    li.appendChild(del);

    ul.appendChild(li);
  }
}


function updateLocalStorage() {
  localStorage[MEOWTO] = JSON.stringify(aliases);
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
