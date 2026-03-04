function copyText(id, btn) {
  var el = document.getElementById(id);
  var text = el.value || el.innerText;
  navigator.clipboard.writeText(text)
    .then(function() {
      btn.textContent = '\u2713 Copied!';
      btn.style.background = '#27AE60';
      setTimeout(function() {
        btn.textContent = 'Copy';
        btn.style.background = '#D4A017';
      }, 2000);
    })
    .catch(function(err) {
      alert('Copy manually:\n' + text);
    });
}
