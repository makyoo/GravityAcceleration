
export enum Material {
  WOOD = 'WOOD',
  IRON = 'IRON'
}

export enum WeightCategory {
  W1KG = 'W1KG',
  W2KG = 'W2KG',
  W5KG = 'W5KG'
}

export interface SphereConfig {
  material: Material;
  weight: WeightCategory;
}

export interface PhysicsParams {
  gravity: number; // m/s^2
}

export const GRAVITY_EARTH = 9.80665;
export const GRAVITY_MOON = 1.625;

export const MATERIAL_PROPERTIES = {
  [Material.WOOD]: { density: 700, color: '#92400e', label: '木质 (Wood)' },
  [Material.IRON]: { density: 7800, color: '#475569', label: '铁质 (Iron)' }
};

export const WEIGHT_SCALE = {
  [WeightCategory.W1KG]: { radius: 10, mass: 1, label: '1KG' },
  [WeightCategory.W2KG]: { radius: 14, mass: 2, label: '2KG' },
  [WeightCategory.W5KG]: { radius: 20, mass: 5, label: '5KG' }
};
