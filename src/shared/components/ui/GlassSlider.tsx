import * as Slider from '@radix-ui/react-slider';
import React from 'react';

interface GlassSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
}

const GlassSlider: React.FC<GlassSliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
}) => (
  <Slider.Root
    className="relative flex items-center select-none touch-none w-full h-8"
    value={[value]}
    min={min}
    max={max}
    step={step}
    onValueChange={(v) => onChange(v[0])}
  >
    <Slider.Track className="bg-white/10 relative grow rounded-vueni-pill h-2">
      <Slider.Range className="absolute bg-gradient-to-r from-blue-400 to-purple-500 rounded-vueni-pill h-full" />
    </Slider.Track>
    <Slider.Thumb className="block w-6 h-6 bg-white/90 hover:bg-white shadow-lg rounded-vueni-pill focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-transform active:scale-110" />
  </Slider.Root>
);

export default GlassSlider;
