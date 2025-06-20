import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/shared/lib/utils';

interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // 0-1
  distortion?: number; // 0-1
  animated?: boolean;
  interactive?: boolean;
  fallbackToCSS?: boolean;
}

const LiquidGlass = ({
  children,
  className,
  intensity = 0.6,
  distortion = 0.4,
  animated = true,
  interactive = true,
  fallbackToCSS = true,
}: LiquidGlassProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const animationRef = useRef<number>();
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTimeRef = useRef(Date.now());

  // WebGL shaders for liquid distortion effect
  const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    
    void main() {
      gl_Position = a_position;
      v_texCoord = a_texCoord;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    
    uniform sampler2D u_texture;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_intensity;
    uniform float u_distortion;
    uniform vec2 u_resolution;
    
    varying vec2 v_texCoord;
    
    void main() {
      vec2 uv = v_texCoord;
      
      // Create liquid distortion effect
      float time = u_time * 0.001;
      vec2 mouse = u_mouse;
      
      // Distance from mouse
      float dist = distance(uv, mouse);
      
      // Liquid wave effect
      float wave1 = sin(dist * 20.0 - time * 3.0) * 0.1;
      float wave2 = cos(uv.x * 15.0 + time * 2.0) * 0.05;
      float wave3 = sin(uv.y * 12.0 - time * 1.5) * 0.03;
      
      // Mouse interaction ripple
      float ripple = smoothstep(0.3, 0.0, dist) * sin(dist * 30.0 - time * 5.0) * 0.2;
      
      // Combine distortions
      vec2 distortionOffset = vec2(
        (wave1 + wave2 + ripple) * u_distortion,
        (wave1 + wave3 + ripple) * u_distortion
      );
      
      // Apply distortion with intensity control
      vec2 distortedUV = uv + distortionOffset * u_intensity;
      
      // Sample the texture with distorted coordinates
      vec4 color = texture2D(u_texture, distortedUV);
      
      // Add subtle color shifting for liquid effect
      float colorShift = sin(dist * 10.0 - time * 2.0) * 0.1 * u_intensity;
      color.rgb += vec3(colorShift * 0.1, colorShift * 0.05, -colorShift * 0.1);
      
      gl_FragColor = color;
    }
  `;

  // Check WebGL support
  const checkWebGLSupport = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebGLSupported(!!gl);
      return !!gl;
    } catch (e) {
      setWebGLSupported(false);
      return false;
    }
  }, []);

  // Create shader
  const createShader = (
    gl: WebGLRenderingContext,
    type: number,
    source: string
  ) => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  // Create shader program
  const createProgram = (gl: WebGLRenderingContext) => {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  };

  // Initialize WebGL
  const initWebGL = useCallback(() => {
    if (!canvasRef.current || !webGLSupported) return;

    const gl =
      canvasRef.current.getContext('webgl') ||
      canvasRef.current.getContext('experimental-webgl');
    if (!gl) return;

    glRef.current = gl;
    programRef.current = createProgram(gl);

    if (!programRef.current) return;

    // Set up geometry (full screen quad)
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);

    const texCoords = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);

    // Position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Texture coordinate buffer
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    // Set up attributes
    const positionLocation = gl.getAttribLocation(
      programRef.current,
      'a_position'
    );
    const texCoordLocation = gl.getAttribLocation(
      programRef.current,
      'a_texCoord'
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
  }, [webGLSupported]);

  // Animation loop
  const animate = useCallback(() => {
    if (!glRef.current || !programRef.current || !canvasRef.current) return;

    const gl = glRef.current;
    const program = programRef.current;

    // Set viewport
    gl.viewport(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Use shader program
    gl.useProgram(program);

    // Set uniforms
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const intensityLocation = gl.getUniformLocation(program, 'u_intensity');
    const distortionLocation = gl.getUniformLocation(program, 'u_distortion');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    if (timeLocation)
      gl.uniform1f(
        timeLocation,
        animated ? Date.now() - startTimeRef.current : 0
      );
    if (mouseLocation) gl.uniform2f(mouseLocation, mousePos.x, mousePos.y);
    if (intensityLocation) gl.uniform1f(intensityLocation, intensity);
    if (distortionLocation) gl.uniform1f(distortionLocation, distortion);
    if (resolutionLocation)
      gl.uniform2f(
        resolutionLocation,
        canvasRef.current.width,
        canvasRef.current.height
      );

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (animated) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [mousePos, intensity, distortion, animated]);

  // Handle mouse movement
  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!interactive || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height; // Flip Y coordinate

      setMousePos({ x, y });
    },
    [interactive]
  );

  // Debounced mouse move for performance
  const debouncedMouseMove = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (event: React.MouseEvent) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => handleMouseMove(event), 16); // ~60fps
      };
    })(),
    [handleMouseMove]
  );

  // Resize canvas
  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }, []);

  // Initialize
  useEffect(() => {
    checkWebGLSupport();
  }, [checkWebGLSupport]);

  useEffect(() => {
    if (webGLSupported) {
      initWebGL();
      resizeCanvas();

      if (animated) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animate();
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [webGLSupported, initWebGL, animate, animated, resizeCanvas]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvas]);

  // CSS fallback styles
  const fallbackStyles =
    !webGLSupported && fallbackToCSS
      ? {
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: `blur(${20 + intensity * 10}px) saturate(${150 + intensity * 30}%)`,
          WebkitBackdropFilter: `blur(${20 + intensity * 10}px) saturate(${150 + intensity * 30}%)`,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.15)
    `,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }
      : {};

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden',
        !webGLSupported && fallbackToCSS && 'liquid-glass-fallback',
        className
      )}
      style={fallbackStyles}
      onMouseMove={interactive ? debouncedMouseMove : undefined}
    >
      {webGLSupported && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ mixBlendMode: 'overlay' }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default LiquidGlass;
