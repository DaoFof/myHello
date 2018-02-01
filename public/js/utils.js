function token (path) {
  // localStorage.getItem('token');
  $.cookie('token',localStorage.getItem('token').toString(),{path: path});
  window.location.href = path;
}
