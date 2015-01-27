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
      show('setup');
      showList();
      show('help');
      break;
    case 'setup':
      show('setup');
      show('help');
    case 'list':
      showList();
      break;
    case 'help':
    case 'halp':
      show('help');
      break;
    case 'nukeall':
      aliases = {};
      updateLocalStorage();
      redirectToList();
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
    show('error');
    show('help');
    return;
  }

  var parsedQuery = cleanQuery.split('->');

  if (parsedQuery.length != 2) {
    show('error');
    show('help');
    return;
  }

  var name = parsedQuery[0].trim();
  var url = parsedQuery[1].trim();

  // If there wasn't an http://, add one.
  if (url.indexOf('http') == -1)
    url = 'http://' + url;

  aliases[name] = url;
  updateLocalStorage();
  redirectToList();
}

function nukeAlias(query) {
  var cleanQuery = queryWithoutCommand(query, 'nuke');
  if (cleanQuery == '') {
    show('error');
    show('help');
    return;
  }

  delete aliases[cleanQuery];
  updateLocalStorage();
  redirectToList()
}

function redirectTo(query) {
  query = decodeURIComponent(query.trim());
  var url = aliases[query];
  if (url && url != '')
    window.location.replace(url);
  else
    show('add');
}

function queryWithoutCommand(query, command) {
  var cleanQuery = decodeURIComponent(query.trim());
  // You might have +s. You shouldn't.
  cleanQuery = cleanQuery.replace(/\+/g, ' ');

  if (cleanQuery.indexOf(command) != 0)
    return ''
  return cleanQuery.substring(command.length).trim();
}

function redirectToList() {
  window.location.replace('?list');
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
    span.className = 'meow';
    span.innerHTML = name;

    var a = document.createElement('a');
    a.innerHTML = aliases[name];
    a.href = aliases[name];
    a.target = '_blank';

    var del = document.createElement('a');
    del.className = 'meow nuke red';
    del.innerHTML = '[delete]';
    del.href = '?nuke ' + name;

    li.appendChild(span);
    li.appendChild(a);
    li.appendChild(del);

    ul.appendChild(li);
  }

  var li = document.createElement('li');
  var a = document.createElement('a');
  a.className = 'meow red';
  a.style.paddingRight = "0";
  a.innerHTML = '[delete all aliases. for reals. no undo]';
  a.href = '?nukeall';
  li.appendChild(a);
  ul.appendChild(li);
}

function updateLocalStorage() {
  localStorage[MEOWTO] = JSON.stringify(aliases);
}

function show(what) {
  document.getElementById(what + '-box').hidden = false;
}
