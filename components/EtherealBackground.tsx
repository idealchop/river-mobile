
import React, { useRef, useEffect } from 'react';

const EtherealBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    class Blob {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      color: string;

      constructor(color: string, radius: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.r = radius;
        this.vx = (Math.random() - 0.5) * 0.4; // Slower velocity
        this.vy = (Math.random() - 0.5) * 0.4; // Slower velocity
        this.color = color;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x - this.r < 0 || this.x + this.r > width) this.vx *= -1;
        if (this.y - this.r < 0 || this.y + this.r > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const blobs = [
      new Blob('rgba(173, 216, 230, 0.5)', width / 2.5), // Light Blue
      new Blob('rgba(255, 255, 255, 0.4)', width / 3),   // White
      new Blob('rgba(135, 206, 250, 0.5)', width / 3.5), // Sky Blue
    ];

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      // This is the key to the soft, smoky effect
      ctx.filter = 'blur(60px)';
      
      blobs.forEach(blob => {
        blob.update();
        blob.draw();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full bg-gradient-to-br from-[#a6c8ff] to-[#dbe9ff]" />;
};

export default EtherealBackground;
