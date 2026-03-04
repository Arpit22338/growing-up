function doCopy(btn, text) {
  var el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'fixed';
  el.style.left = '-9999px';
  el.style.top = '0';
  el.setAttribute('readonly', '');
  document.body.appendChild(el);
  el.focus();
  el.select();
  el.setSelectionRange(0, 99999);
  try {
    document.execCommand('copy');
    btn.textContent = '\u2713 Copied!';
    btn.style.background = '#27AE60';
    setTimeout(function() {
      btn.textContent = 'Copy';
      btn.style.background = '#D4A017';
    }, 2000);
  } catch(e) {
    alert('Please copy manually: ' + text);
  }
  document.body.removeChild(el);
}
