import React from 'react';

/**
 * SVG Filters for WWDC 2025 Liquid Glass Effects
 * Provides realistic distortion, lighting, and refraction effects
 */
export const LiquidGlassSVGFilters: React.FC = () => {
  return (
    <svg 
      className="liquid-glass-svg-filters" 
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        {/* Primary Glass Distortion Filter */}
        <filter
          id="glass-distortion-primary"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.01"
            numOctaves="2"
            seed="5"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="8" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="2" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="3"
            specularConstant="0.8"
            specularExponent="80"
            lightingColor="rgba(255,255,255,0.8)"
            result="specLight"
          >
            <fePointLight x="-150" y="-150" z="250" />
          </feSpecularLighting>
          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="120"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Hover State Glass Distortion */}
        <filter
          id="glass-distortion-hover"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.015"
            numOctaves="2"
            seed="7"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1.2" exponent="6" offset="0.4" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.6" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="1.5" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="4"
            specularConstant="1.2"
            specularExponent="100"
            lightingColor="rgba(255,255,255,0.9)"
            result="specLight"
          >
            <fePointLight x="-120" y="-120" z="280" />
          </feSpecularLighting>
          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="150"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Navigation Glass Distortion */}
        <filter
          id="glass-distortion-nav"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.008"
            numOctaves="1"
            seed="3"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="0.8" exponent="12" offset="0.6" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.4" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="2"
            specularConstant="0.6"
            specularExponent="60"
            lightingColor="rgba(255,255,255,0.6)"
            result="specLight"
          >
            <fePointLight x="-200" y="-200" z="200" />
          </feSpecularLighting>
          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="80"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Navigation Hover Glass Distortion */}
        <filter
          id="glass-distortion-nav-hover"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.012"
            numOctaves="1"
            seed="4"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="2.5" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="2.5"
            specularConstant="0.8"
            specularExponent="70"
            lightingColor="rgba(255,255,255,0.7)"
            result="specLight"
          >
            <fePointLight x="-180" y="-180" z="220" />
          </feSpecularLighting>
          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="100"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Button Glass Distortion */}
        <filter
          id="glass-distortion-button"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.012"
            numOctaves="1"
            seed="8"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="0.9" exponent="9" offset="0.55" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.45" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="2" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="2.5"
            specularConstant="0.7"
            specularExponent="90"
            lightingColor="rgba(255,255,255,0.8)"
            result="specLight"
          >
            <fePointLight x="-160" y="-160" z="240" />
          </feSpecularLighting>
          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="90"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Button Hover Glass Distortion */}
        <filter
          id="glass-distortion-button-hover"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.016 0.016"
            numOctaves="1"
            seed="9"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1.1" exponent="7" offset="0.45" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.55" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="1.5" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="3"
            specularConstant="1"
            specularExponent="110"
            lightingColor="rgba(255,255,255,0.9)"
            result="specLight"
          >
            <fePointLight x="-140" y="-140" z="260" />
          </feSpecularLighting>
          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="120"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Card Glass Distortion */}
        <filter
          id="glass-distortion-card"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.009 0.009"
            numOctaves="2"
            seed="6"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="0.8" exponent="10" offset="0.6" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.4" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="2.5" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="2"
            specularConstant="0.6"
            specularExponent="70"
            lightingColor="rgba(255,255,255,0.7)"
            result="specLight"
          >
            <fePointLight x="-180" y="-180" z="220" />
          </feSpecularLighting>
          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="100"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Card Hover Glass Distortion */}
        <filter
          id="glass-distortion-card-hover"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.013 0.013"
            numOctaves="2"
            seed="11"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="8" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="2" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="3"
            specularConstant="0.9"
            specularExponent="90"
            lightingColor="rgba(255,255,255,0.8)"
            result="specLight"
          >
            <fePointLight x="-160" y="-160" z="240" />
          </feSpecularLighting>
          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="130"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Menu Item Glass Distortion */}
        <filter
          id="glass-distortion-menu"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014 0.014"
            numOctaves="1"
            seed="12"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="0.7" exponent="11" offset="0.65" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.35" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="1.8" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="1.5"
            specularConstant="0.5"
            specularExponent="50"
            lightingColor="rgba(255,255,255,0.6)"
            result="specLight"
          >
            <fePointLight x="-200" y="-200" z="180" />
          </feSpecularLighting>
          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="60"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Menu Item Hover Glass Distortion */}
        <filter
          id="glass-distortion-menu-hover"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.016 0.016"
            numOctaves="1"
            seed="13"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="0.9" exponent="9" offset="0.55" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.45" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="1.5" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="2"
            specularConstant="0.7"
            specularExponent="70"
            lightingColor="rgba(255,255,255,0.7)"
            result="specLight"
          >
            <fePointLight x="-180" y="-180" z="200" />
          </feSpecularLighting>
          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="80"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Menu Item Active Glass Distortion */}
        <filter
          id="glass-distortion-menu-active"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018 0.018"
            numOctaves="1"
            seed="14"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="8" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="1.2" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="2.5"
            specularConstant="0.9"
            specularExponent="90"
            lightingColor="rgba(99,102,241,0.8)"
            result="specLight"
          >
            <fePointLight x="-160" y="-160" z="220" />
          </feSpecularLighting>
          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="90"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* FAB Glass Distortion */}
        <filter
          id="glass-distortion-fab"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.015"
            numOctaves="1"
            seed="15"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="8" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="1.5" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="3"
            specularConstant="1"
            specularExponent="100"
            lightingColor="rgba(99,102,241,0.9)"
            result="specLight"
          >
            <fePointLight x="-140" y="-140" z="250" />
          </feSpecularLighting>
          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="110"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* FAB Hover Glass Distortion */}
        <filter
          id="glass-distortion-fab-hover"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018 0.018"
            numOctaves="1"
            seed="16"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1.2" exponent="6" offset="0.4" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.6" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="1.2" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="4"
            specularConstant="1.3"
            specularExponent="120"
            lightingColor="rgba(99,102,241,1)"
            result="specLight"
          >
            <fePointLight x="-120" y="-120" z="280" />
          </feSpecularLighting>
          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="140"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Animated Flow Filters for Liquid Animation */}
        <filter
          id="glass-distortion-flow-1"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011 0.008"
            numOctaves="2"
            seed="17"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2.2" result="softMap" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="95"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter
          id="glass-distortion-flow-2"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.013 0.009"
            numOctaves="2"
            seed="18"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="1.8" result="softMap" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="110"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter
          id="glass-distortion-flow-3"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.009 0.012"
            numOctaves="2"
            seed="19"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2.5" result="softMap" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="85"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default LiquidGlassSVGFilters; 