// Keep the drawing on the same bitmap when the surrounding layout changes size.
globalThis.InkPad = (() => {
  function attach(canvas, onChange = () => {}) {
    const surface = canvas.getContext('2d');
    const bounds = canvas.getBoundingClientRect();
    const scale = Math.min(3, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(bounds.width * scale));
    canvas.height = Math.max(1, Math.round(bounds.height * scale));
    const strokes = [];
    let pointer = null, locked = false;
    const width = Math.max(2, Math.min(canvas.width, canvas.height) * .028);
    surface.strokeStyle = surface.fillStyle = '#a93d1e';
    surface.lineWidth = width;
    surface.lineCap = surface.lineJoin = 'round';

    function point(e) {
      const rect = canvas.getBoundingClientRect();
      return [(e.clientX - rect.left) * canvas.width / rect.width,
              (e.clientY - rect.top) * canvas.height / rect.height];
    }
    function dot([x,y]) {
      surface.beginPath();
      surface.arc(x, y, width / 2, 0, 2 * Math.PI);
      surface.fill();
    }
    function segment(from, to) {
      surface.beginPath();
      surface.moveTo(...from);
      surface.lineTo(...to);
      surface.stroke();
    }
    function redraw() {
      surface.clearRect(0, 0, canvas.width, canvas.height);
      for (const stroke of strokes) {
        dot(stroke[0]);
        for (let i = 1; i < stroke.length; i++) segment(stroke[i-1], stroke[i]);
      }
      onChange(strokes.length);
    }
    function lift() {
      const id = pointer;
      pointer = null;
      if (id !== null && canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
    }
    canvas.onpointerdown = e => {
      if (locked || pointer !== null || e.button !== 0) return;
      e.preventDefault();
      pointer = e.pointerId;
      canvas.setPointerCapture(pointer);
      const start = point(e);
      strokes.push([start]);
      dot(start);
      onChange(strokes.length);
    };
    canvas.onpointermove = e => {
      if (pointer !== e.pointerId) return;
      const stroke = strokes.at(-1), next = point(e);
      segment(stroke.at(-1), next);
      stroke.push(next);
    };
    canvas.onpointerup = canvas.onpointercancel = e => { if (e.pointerId === pointer) lift(); };
    canvas.onlostpointercapture = e => { if (e.pointerId === pointer) pointer = null; };
    return {
      undo() { if (!locked) { lift(); strokes.pop(); redraw(); } },
      clear() { if (!locked) { lift(); strokes.length = 0; redraw(); } },
      lock() { lift(); locked = true; }
    };
  }
  return {attach};
})();
