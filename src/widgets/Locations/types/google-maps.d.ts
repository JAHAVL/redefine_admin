// Google Maps type declarations
declare module 'google.maps' {
  export = google.maps;
}

declare namespace google.maps {
  class Map {
    constructor(element: HTMLElement, options?: MapOptions);
    setCenter(latLng: LatLng | LatLngLiteral): void;
    setZoom(zoom: number): void;
    fitBounds(bounds: LatLngBounds): void;
    panTo(latLng: LatLng | LatLngLiteral): void;
  }

  class Marker {
    constructor(options?: MarkerOptions);
    setMap(map: Map | null): void;
    setPosition(latLng: LatLng | LatLngLiteral): void;
    setTitle(title: string): void;
    setIcon(icon: string | Icon | Symbol | null): void;
    getPosition(): LatLng;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  class LatLngBounds {
    extend(point: LatLng | LatLngLiteral): void;
  }

  class InfoWindow {
    constructor(options?: InfoWindowOptions);
    setContent(content: string | Node): void;
    open(map: Map, marker?: Marker): void;
    close(): void;
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    styles?: MapTypeStyle[];
  }

  interface MarkerOptions {
    position?: LatLng | LatLngLiteral;
    map?: Map;
    title?: string;
    icon?: string | Icon | Symbol;
    animation?: Animation;
  }

  interface InfoWindowOptions {
    content?: string | Node;
    position?: LatLng | LatLngLiteral;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface MapTypeStyle {
    featureType?: string;
    elementType?: string;
    stylers?: MapTypeStyler[];
  }

  interface MapTypeStyler {
    visibility?: string;
    [key: string]: any;
  }

  interface Icon {
    url: string;
    scaledSize?: Size;
  }

  interface Size {
    width: number;
    height: number;
  }

  interface Symbol {
    path: string;
    fillOpacity?: number;
    fillColor?: string;
    strokeOpacity?: number;
    strokeColor?: string;
    strokeWeight?: number;
    scale?: number;
  }

  const Animation: {
    DROP: number;
    BOUNCE: number;
  };

  const event: {
    addListener(instance: any, eventName: string, handler: Function): any;
    removeListener(listener: any): void;
  };

  namespace places {
    // Add any places API types if needed
  }
}

declare global {
  interface Window {
    google: {
      maps: typeof google.maps;
    };
  }
}

export {};
