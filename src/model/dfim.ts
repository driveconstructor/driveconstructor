/** Maximum absolute slip used by the simplified DFIM sizing model. */
export const DFIM_MAX_SLIP = 0.3;

/** Approximate installed stator-plus-rotor cable quantity. */
export const DFIM_CABLE_QUANTITY_FACTOR = 1.33;

/**
 * Approximate stator-plus-rotor resistive loss for equal cable resistance,
 * where rotor current is represented by the maximum-slip fraction.
 */
export const DFIM_CABLE_LOSS_FACTOR = 1 + DFIM_MAX_SLIP ** 2;
