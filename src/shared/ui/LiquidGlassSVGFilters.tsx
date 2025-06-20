import React from 'react';

/**
 * SVG Filters for Modern Glass Effects
 * Provides subtle, realistic glass effects without aggressive distortion
 */
export const LiquidGlassSVGFilters: React.FC = () => {
  return (
    <svg 
      className="liquid-glass-svg-filters" 
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        {/* Primary Glass Effect - Subtle lighting only */}
        <filter
          id="glass-distortion-primary"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="1"
            specularConstant="0.3"
            specularExponent="20"
            lightingColor="rgba(255,255,255,0.1)"
            result="specLight"
          >
            <fePointLight x="-50" y="-50" z="100" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.2"
            k4="0"
          />
        </filter>

        {/* Hover State - Slightly enhanced lighting */}
        <filter
          id="glass-distortion-hover"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="blur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="1.2"
            specularConstant="0.4"
            specularExponent="25"
            lightingColor="rgba(255,255,255,0.15)"
            result="specLight"
          >
            <fePointLight x="-40" y="-40" z="120" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.3"
            k4="0"
          />
        </filter>

        {/* Navigation - Minimal effect */}
        <filter
          id="glass-distortion-nav"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feSpecularLighting
            in="SourceGraphic"
            surfaceScale="0.5"
            specularConstant="0.2"
            specularExponent="15"
            lightingColor="rgba(255,255,255,0.08)"
            result="specLight"
          >
            <fePointLight x="-100" y="-100" z="80" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.15"
            k4="0"
          />
        </filter>

        {/* Navigation Hover */}
        <filter
          id="glass-distortion-nav-hover"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feSpecularLighting
            in="SourceGraphic"
            surfaceScale="0.8"
            specularConstant="0.3"
            specularExponent="20"
            lightingColor="rgba(255,255,255,0.12)"
            result="specLight"
          >
            <fePointLight x="-80" y="-80" z="100" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.2"
            k4="0"
          />
        </filter>

        {/* Button - Clean glass effect */}
        <filter
          id="glass-distortion-button"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feSpecularLighting
            in="SourceGraphic"
            surfaceScale="0.8"
            specularConstant="0.25"
            specularExponent="18"
            lightingColor="rgba(255,255,255,0.1)"
            result="specLight"
          >
            <fePointLight x="-60" y="-60" z="90" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.18"
            k4="0"
          />
        </filter>

        {/* Button Hover */}
        <filter
          id="glass-distortion-button-hover"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feSpecularLighting
            in="SourceGraphic"
            surfaceScale="1"
            specularConstant="0.35"
            specularExponent="22"
            lightingColor="rgba(255,255,255,0.15)"
            result="specLight"
          >
            <fePointLight x="-50" y="-50" z="110" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.25"
            k4="0"
          />
        </filter>

        {/* Card - Subtle glass effect */}
        <filter
          id="glass-distortion-card"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feSpecularLighting
            in="SourceGraphic"
            surfaceScale="0.6"
            specularConstant="0.2"
            specularExponent="16"
            lightingColor="rgba(255,255,255,0.08)"
            result="specLight"
          >
            <fePointLight x="-70" y="-70" z="85" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.12"
            k4="0"
          />
        </filter>

        {/* Card Hover */}
        <filter
          id="glass-distortion-card-hover"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feSpecularLighting
            in="SourceGraphic"
            surfaceScale="0.9"
            specularConstant="0.3"
            specularExponent="20"
            lightingColor="rgba(255,255,255,0.12)"
            result="specLight"
          >
            <fePointLight x="-60" y="-60" z="100" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.18"
            k4="0"
          />
        </filter>

        {/* Menu Item - Very subtle */}
        <filter
          id="glass-distortion-menu"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feSpecularLighting
            in="SourceGraphic"
            surfaceScale="0.4"
            specularConstant="0.15"
            specularExponent="12"
            lightingColor="rgba(255,255,255,0.06)"
            result="specLight"
          >
            <fePointLight x="-80" y="-80" z="70" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.1"
            k4="0"
          />
        </filter>

        {/* Menu Item Hover */}
        <filter
          id="glass-distortion-menu-hover"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feSpecularLighting
            in="SourceGraphic"
            surfaceScale="0.6"
            specularConstant="0.2"
            specularExponent="15"
            lightingColor="rgba(255,255,255,0.08)"
            result="specLight"
          >
            <fePointLight x="-70" y="-70" z="80" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.12"
            k4="0"
          />
        </filter>

        {/* Menu Item Active */}
        <filter
          id="glass-distortion-menu-active"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feSpecularLighting
            in="SourceGraphic"
            surfaceScale="0.8"
            specularConstant="0.25"
            specularExponent="18"
            lightingColor="rgba(99,102,241,0.1)"
            result="specLight"
          >
            <fePointLight x="-60" y="-60" z="90" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.15"
            k4="0"
          />
        </filter>

        {/* FAB - Enhanced but clean */}
        <filter
          id="glass-distortion-fab"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feSpecularLighting
            in="SourceGraphic"
            surfaceScale="1"
            specularConstant="0.3"
            specularExponent="20"
            lightingColor="rgba(99,102,241,0.12)"
            result="specLight"
          >
            <fePointLight x="-50" y="-50" z="100" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.2"
            k4="0"
          />
        </filter>

        {/* FAB Hover */}
        <filter
          id="glass-distortion-fab-hover"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feSpecularLighting
            in="SourceGraphic"
            surfaceScale="1.2"
            specularConstant="0.4"
            specularExponent="25"
            lightingColor="rgba(99,102,241,0.15)"
            result="specLight"
          >
            <fePointLight x="-40" y="-40" z="120" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.25"
            k4="0"
          />
        </filter>

        {/* Animated Flow Filters - Very subtle movement */}
        <filter
          id="glass-distortion-flow-1"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feSpecularLighting
            in="SourceGraphic"
            surfaceScale="0.8"
            specularConstant="0.25"
            specularExponent="18"
            lightingColor="rgba(255,255,255,0.08)"
            result="specLight"
          >
            <fePointLight x="-55" y="-45" z="95" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.15"
            k4="0"
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
          <feSpecularLighting
            in="SourceGraphic"
            surfaceScale="0.9"
            specularConstant="0.3"
            specularExponent="20"
            lightingColor="rgba(255,255,255,0.1)"
            result="specLight"
          >
            <fePointLight x="-45" y="-55" z="105" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.18"
            k4="0"
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
          <feSpecularLighting
            in="SourceGraphic"
            surfaceScale="0.7"
            specularConstant="0.2"
            specularExponent="16"
            lightingColor="rgba(255,255,255,0.06)"
            result="specLight"
          >
            <fePointLight x="-65" y="-35" z="85" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.12"
            k4="0"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default LiquidGlassSVGFilters; 