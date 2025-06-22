declare module 'vanta/dist/vanta.topology.min' {
    import * as THREE from 'three';
  
    interface VantaSettings {
      el: HTMLElement | null;
      THREE: typeof THREE;
      mouseControls?: boolean;
      touchControls?: boolean;
      gyroControls?: boolean;
      minHeight?: number;
      minWidth?: number;
      scale?: number;
      scaleMobile?: number;
      color?: number | string;
      backgroundColor?: number | string;
    }
  
    interface VantaEffect {
      destroy: () => void;
    }
  
    const VantaTopology: (settings: VantaSettings) => VantaEffect;
    export default VantaTopology;
  }