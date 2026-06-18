/* =========================================
   sidebar.js
   Toggles the off-canvas sidebar that opens
   from the navbar's hamburger (.menu-icon).
   Include this file on every page that uses
   the shared .navbar / .sidebar markup.
   ========================================= */

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
  document.getElementById('sidebarOverlay').classList.toggle('active');
  document.body.classList.toggle('sidebar-open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('active');
  document.getElementById('sidebarOverlay').classList.remove('active');
  document.body.classList.remove('sidebar-open');
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeSidebar();
});
