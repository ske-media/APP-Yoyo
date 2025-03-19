// Types for thermal and HVAC calculations

export interface ClimateData {
  exteriorTemperature: number;
  humidity: number;
  solarRadiation: number;
  windSpeed: number;
  windDirection: number;
}

export interface BuildingMaterial {
  name: string;
  thermalConductivity: number; // λ (W/m·K)
  thickness: number; // meters
  thermalResistance?: number; // R-value (m²·K/W),
  surfaceResistance?: {
    interior: number; // Rsi (m²·K/W)
    exterior: number; // Rse (m²·K/W)
  }
}

export interface Wall {
  area: number; // m²
  materials: BuildingMaterial[];
  orientation: 'nord' | 'sud' | 'est' | 'ouest';
  type: 'mur' | 'plancher' | 'toit' | 'fenêtre' | 'porte';
  inclinaison?: number; // degrés
  masqueSolaire?: {
    angle: number; // degrés
    distance: number; // mètres
  };
  pontsThermiques?: {
    type: 'linéaire' | 'ponctuel';
    valeur: number; // W/K pour linéaire, W/K pour ponctuel
    longueur?: number; // mètres (pour linéaire)
  }[];
}

export interface Building {
  nom: string;
  localisation: {
    latitude: number;
    longitude: number;
    altitude: number;
    zoneClimatique: 'H1a' | 'H1b' | 'H1c' | 'H2a' | 'H2b' | 'H2c' | 'H2d' | 'H3';
  };
  dimensions: {
    surfaceHabitable: number; // m²
    volume: number; // m³
    hauteurSousPLafond: number; // m
  };
  enveloppe: {
    murs: Wall[];
    planchers: Wall[];
    toiture: Wall[];
    menuiseries: Wall[];
  };
  ventilation: VentilationSystem;
  occupation: OccupancyData;
  equipements: {
    chauffage: {
      type: 'gaz' | 'électrique' | 'pompeAChaleur' | 'biomasse';
      puissance: number; // kW
      rendement: number; // %
    };
    eauChaudeSanitaire: {
      type: 'instantané' | 'accumulation';
      volume?: number; // litres
      puissance: number; // kW
    };
    climatisation?: {
      puissance: number; // kW
      seer: number; // coefficient d'efficacité énergétique saisonnière
    };
  };
}

export interface ThermalCalculation {
  calculateUValue: (materials: BuildingMaterial[]) => number;
  calculateHeatLoss: (uValue: number, area: number, tempDiff: number) => number;
}

export interface VentilationSystem {
  type: 'single-flow' | 'double-flow' | 'natural' | 'mechanical';
  airFlow: number; // m³/h
  heatRecoveryEfficiency?: number; // for double-flow systems
}

export interface OccupancyData {
  occupants: number;
  schedule: {
    start: string;
    end: string;
  }[];
  internalHeatGains: number; // W/m²
}