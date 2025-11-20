import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

/**
 * d.ai.ly Logo Component
 * A modern SVG-based logo for the app
 * 
 * @param {number} width - Width of the logo (default: 120)
 * @param {number} height - Height of the logo (default: 40)
 * @param {string} variant - 'default' | 'white' | 'dark' (default: 'default')
 */
export default function DailyLogo({ width = 120, height = 40, variant = 'default' }) {
  // Color variants
  const colors = {
    default: {
      d: '#6366f1', // Primary indigo
      ai: '#10b981', // Green accent for "ai"
      ly: '#6366f1', // Primary indigo
    },
    white: {
      d: '#ffffff',
      ai: '#ffffff',
      ly: '#ffffff',
    },
    dark: {
      d: '#1f2937',
      ai: '#374151',
      ly: '#1f2937',
    },
  };

  const currentColors = colors[variant] || colors.default;

  return (
    <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={width} height={height} viewBox="0 0 120 40">
        <Defs>
          <LinearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#10b981" stopOpacity="1" />
            <Stop offset="100%" stopColor="#34d399" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        
        {/* d */}
        <SvgText
          x="5"
          y="28"
          fontSize="24"
          fontWeight="700"
          fontFamily="System"
          fill={currentColors.d}
        >
          d
        </SvgText>
        
        {/* . (dot after d) */}
        <SvgText
          x="23"
          y="28"
          fontSize="24"
          fontWeight="700"
          fontFamily="System"
          fill={currentColors.d}
        >
          .
        </SvgText>
        
        {/* ai (with gradient if default variant) */}
        <SvgText
          x="30"
          y="28"
          fontSize="24"
          fontWeight="700"
          fontFamily="System"
          fill={variant === 'default' ? 'url(#aiGradient)' : currentColors.ai}
        >
          ai
        </SvgText>
        
        {/* . (dot after ai) */}
        <SvgText
          x="60"
          y="28"
          fontSize="24"
          fontWeight="700"
          fontFamily="System"
          fill={currentColors.ai}
        >
          .
        </SvgText>
        
        {/* ly */}
        <SvgText
          x="67"
          y="28"
          fontSize="24"
          fontWeight="700"
          fontFamily="System"
          fill={currentColors.ly}
        >
          ly
        </SvgText>
      </Svg>
    </View>
  );
}

/**
 * Icon version - Square logo for use as app icon
 */
export function DailyLogoIcon({ size = 60, variant = 'default' }) {
  const colors = {
    default: {
      bg: '#6366f1',
      text: '#ffffff',
      ai: '#10b981',
    },
    white: {
      bg: '#ffffff',
      text: '#6366f1',
      ai: '#10b981',
    },
    dark: {
      bg: '#1f2937',
      text: '#ffffff',
      ai: '#34d399',
    },
  };

  const currentColors = colors[variant] || colors.default;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        <Defs>
          <LinearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#6366f1" stopOpacity="1" />
            <Stop offset="100%" stopColor="#818cf8" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        
        {/* Background */}
        <Rect
          x="0"
          y="0"
          width="60"
          height="60"
          rx="12"
          fill={variant === 'default' ? 'url(#bgGradient)' : currentColors.bg}
        />
        
        {/* d.ai */}
        <SvgText
          x="8"
          y="26"
          fontSize="14"
          fontWeight="700"
          fontFamily="System"
          fill={currentColors.text}
        >
          d.
        </SvgText>
        
        <SvgText
          x="24"
          y="26"
          fontSize="14"
          fontWeight="700"
          fontFamily="System"
          fill={currentColors.ai}
        >
          ai
        </SvgText>
        
        {/* .ly */}
        <SvgText
          x="15"
          y="42"
          fontSize="14"
          fontWeight="700"
          fontFamily="System"
          fill={currentColors.text}
        >
          .ly
        </SvgText>
      </Svg>
    </View>
  );
}

/**
 * Compact version - For use in tight spaces like headers
 */
export function DailyLogoCompact({ height = 30, variant = 'default' }) {
  const width = height * 2.5; // Maintain aspect ratio

  const colors = {
    default: {
      d: '#6366f1',
      ai: '#10b981',
      ly: '#6366f1',
    },
    white: {
      d: '#ffffff',
      ai: '#ffffff',
      ly: '#ffffff',
    },
    dark: {
      d: '#1f2937',
      ai: '#374151',
      ly: '#1f2937',
    },
  };

  const currentColors = colors[variant] || colors.default;
  const fontSize = height * 0.6;

  return (
    <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={width} height={height} viewBox="0 0 75 30">
        <Defs>
          <LinearGradient id="aiGradientCompact" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#10b981" stopOpacity="1" />
            <Stop offset="100%" stopColor="#34d399" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        
        <SvgText
          x="2"
          y="21"
          fontSize={fontSize}
          fontWeight="700"
          fontFamily="System"
          fill={currentColors.d}
        >
          d.
        </SvgText>
        
        <SvgText
          x="20"
          y="21"
          fontSize={fontSize}
          fontWeight="700"
          fontFamily="System"
          fill={variant === 'default' ? 'url(#aiGradientCompact)' : currentColors.ai}
        >
          ai
        </SvgText>
        
        <SvgText
          x="45"
          y="21"
          fontSize={fontSize}
          fontWeight="700"
          fontFamily="System"
          fill={currentColors.ly}
        >
          .ly
        </SvgText>
      </Svg>
    </View>
  );
}
