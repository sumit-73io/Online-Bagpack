function showSection(sectionId) {

  // Hide all sections
  document.querySelectorAll('.section-box').forEach(sec => {
    sec.style.display = 'none';
  });

  // Show selected
  document.getElementById(sectionId).style.display = 'block';

  // Remove active from all buttons
  document.querySelectorAll('.sidebar button').forEach(button => {
    button.classList.remove('active');
  });

  // Add active using data attribute
  document.querySelectorAll('.sidebar button').forEach(button => {
    if (button.dataset.section === sectionId) {
      button.classList.add('active');
    }
  });
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}