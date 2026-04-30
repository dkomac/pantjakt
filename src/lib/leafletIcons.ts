import L from 'leaflet'

interface PinIconOptions {
  size?: number
  color?: string
}

export function createPinIcon({ size = 18, color = '#10b981' }: PinIconOptions = {}): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    "></div>`,
    iconAnchor: [size / 2, size / 2],
    iconSize: [size, size],
  })
}

export function createPillIcon(label: string, color = '#10b981'): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="
      background: ${color};
      color: white;
      font-family: Inter, system-ui, sans-serif;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 9px;
      border-radius: 20px;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.20);
      border: 2px solid white;
      transform: translateX(-50%);
      display: inline-block;
    ">${label}</div>`,
    iconAnchor: [0, 8],
    popupAnchor: [0, -16],
  })
}
