export function drawPitch(canvas: HTMLCanvasElement | null): void {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width, height } = canvas;
  ctx.fillStyle = "#0b5d23";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, width - 40, height - 40);
  ctx.beginPath();
  ctx.moveTo(width / 2, 20);
  ctx.lineTo(width / 2, height - 20);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 60, 0, Math.PI * 2);
  ctx.stroke();
  drawBox(ctx, 20, height / 2 - 70, 80, 140);
  drawBox(ctx, width - 100, height / 2 - 70, 80, 140);
  ctx.beginPath();
  ctx.arc(20 + 40, height / 2, 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(width - 60, height / 2, 12, 0, Math.PI * 2);
  ctx.stroke();
}

function drawBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  ctx.strokeRect(x, y, width, height);
  ctx.strokeRect(x, y + 30, width, height - 60);
}
