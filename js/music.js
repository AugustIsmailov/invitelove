const music = document.getElementById('background-music');
const toggleButton = document.getElementById('toggle-music');

toggleButton.addEventListener('click', () => {
    if (music.muted) {
        music.muted = false;
        toggleButton.textContent = '🔊 Отключить звук';
        toggleButton.classList.remove('muted');
    } else {
        music.muted = true;
        toggleButton.textContent = '🔇 Включить звук';
        toggleButton.classList.add('muted');
    }
});
