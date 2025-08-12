export function makeDraggable({ selector, onDrop }) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('pointerdown', (e) => {
      const clone = el.cloneNode(true);
      clone.style.position = 'fixed';
      clone.style.left = `${e.clientX}px`;
      clone.style.top = `${e.clientY}px`;
      clone.style.pointerEvents = 'none';
      document.body.appendChild(clone);

      function move(ev) {
        clone.style.left = `${ev.clientX}px`;
        clone.style.top = `${ev.clientY}px`;
      }

      function up(ev) {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        const target = document.elementFromPoint(ev.clientX, ev.clientY);
        document.body.removeChild(clone);
        onDrop?.(el, target);
      }

      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    });
  });
}
