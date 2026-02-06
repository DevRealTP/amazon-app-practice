const removelabels = document.getElementById('remove');
const icons = document.querySelectorAll('.toggle-icon');

removelabels.addEventListener('click', () => {
  icons.forEach(icon => icon.classList.toggle('icons-hidden'));
  removelabels.textContent = removelabels.textContent.trim() === 'ON' ? 'OFF' : 'ON';
});

