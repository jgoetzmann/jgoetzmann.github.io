// Damage Types (defined here to avoid circular dependencies)
export const DAMAGE_TYPES = {
    PHYSICAL: 'physical',
    EXPLOSIVE: 'explosive',
    POISON: 'poison',
    MAGIC: 'magic',
    TRUE: 'true',
    ELECTRICAL: 'electrical'
};

// Tower Categories
export const TOWER_CATEGORIES = {
    DAMAGE: 'damage',
    SUPPORT: 'support',
    ECON: 'econ'
};

// Game Constants
export const GAME_CONFIG = {
    CANVAS_WIDTH: 960,
    CANVAS_HEIGHT: 480,
    TRACK_Y_START: 200,
    TRACK_Y_END: 280,
    TRACK_HEIGHT: 80,
    INITIAL_MONEY: 800,
    INITIAL_LIVES: 200,
    INITIAL_ROUND: 1000,
    GAME_LOOP_INTERVAL: 20,
    ROUND_DURATION: 1000,
    SPAWN_INTERVAL: 30,
    WIN_ROUND: 100000
};

// Enemy Types Configuration
export const ENEMY_TYPES = {
    NIL: { id: 0, name: "nil", hp: 0, speed: 0, size: 0, positionX: 0, positionY: 200, dead: true },
    TINY: { id: 1, name: "tiny", hp: 10, speed: 0.5, size: 5, positionX: -10, positionY: 200 },
    SMALL: { id: 2, name: "small", hp: 30, speed: 0.4, size: 10, positionX: -15, positionY: 200 },
    SMALL_FAST: { id: 3, name: "small-f", hp: 30, speed: 1.2, size: 10, positionX: -15, positionY: 200 },
    NORMAL: { id: 4, name: "normal", hp: 100, speed: 0.3, size: 20, positionX: -25, positionY: 200 },
    NORMAL_FAST: { id: 5, name: "normal-f", hp: 100, speed: 0.9, size: 20, positionX: -25, positionY: 200 },
    NORMAL_SLOW: { id: 6, name: "normal-s", hp: 300, speed: 0.25, size: 20, positionX: -25, positionY: 200 },
    LARGE: { id: 7, name: "large", hp: 500, speed: 0.2, size: 30, positionX: -35, positionY: 200 },
    LARGE_FAST: { id: 8, name: "large-f", hp: 500, speed: 0.6, size: 30, positionX: -35, positionY: 200 },
    LARGE_SLOW: { id: 9, name: "large-s", hp: 1500, speed: 0.17, size: 30, positionX: -35, positionY: 200 },
    HUGE: { id: 10, name: "huge", hp: 5000, speed: 0.1, size: 50, positionX: -55, positionY: 200 },
    BOSS: { id: 11, name: "boss", hp: 25000, speed: 0.05, size: 75, positionX: -80, positionY: 200 }
};

// Enemy Properties
export const ENEMY_PROPERTIES = {
    NONE: 0,
    RED: 1,
    BLUE: 2
};

// Lives Cost by Enemy Type
export const LIVES_COST = {
    11: 200, // boss
    10: 100, // huge
    9: 25,   // large-s
    8: 25,   // large-f
    7: 25,   // large
    6: 10,   // normal-s
    5: 10,   // normal-f
    4: 10,   // normal
    3: 3,    // small-f
    2: 3,    // small
    1: 1     // tiny
};

// Building Types Configuration
// Note: damageFamily and category will be set in Building constructor using DamageSystem
// All new stats default to: penetration=0, crit=0/100, fortifiedScaler=1.0, ccResist=0
export const BUILDING_TYPES = {
    CANNON: { 
        id: 0, name: "cannon", property: 1, size: 5, range: 50, attackSpeed: 30, damage: 5, targets: 1,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.PHYSICAL,
        damageTypes: {[DAMAGE_TYPES.PHYSICAL]: 1.0}, penetration: {}, critChance: 0, critDamage: 100,
        fortifiedScaler: 1.0, ccResist: 0
    },
    MULTI_CANNON: { 
        id: 1, name: "multi cannon", property: 1, size: 7.5, range: 30, attackSpeed: 30, damage: 7.5, targets: 3,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.PHYSICAL,
        damageTypes: {[DAMAGE_TYPES.PHYSICAL]: 1.0}, penetration: {}, critChance: 0, critDamage: 100,
        fortifiedScaler: 1.0, ccResist: 0
    },
    HUGE_CANNON: { 
        id: 2, name: "huge cannon", property: 1, size: 12.5, range: 100, attackSpeed: 120, damage: 250, targets: 1,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.EXPLOSIVE,
        damageTypes: {[DAMAGE_TYPES.EXPLOSIVE]: 1.0}, penetration: {}, critChance: 0, critDamage: 100,
        fortifiedScaler: 1.0, ccResist: 0
    },
    LASER: { 
        id: 3, name: "laser", property: 2, size: 5, range: 60, attackSpeed: 5, damage: 5, targets: 1,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.MAGIC,
        damageTypes: {[DAMAGE_TYPES.MAGIC]: 1.0}, penetration: {}, critChance: 0, critDamage: 100,
        fortifiedScaler: 1.0, ccResist: 0
    },
    FROST_LASER: { 
        id: 4, name: "frost laser", property: 2, size: 7.5, range: 50, attackSpeed: 5, damage: 0.9, targets: 1,
        category: TOWER_CATEGORIES.SUPPORT, damageFamily: DAMAGE_TYPES.MAGIC,
        damageTypes: {[DAMAGE_TYPES.MAGIC]: 1.0}, penetration: {}, critChance: 0, critDamage: 100,
        fortifiedScaler: 1.0, ccResist: 0
    },
    CHAIN_LASER: { 
        id: 5, name: "chain laser", property: 2, size: 12.5, range: 100, attackSpeed: 200, damage: 100, targets: 5,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.ELECTRICAL,
        damageTypes: {[DAMAGE_TYPES.ELECTRICAL]: 1.0}, penetration: {}, critChance: 0, critDamage: 100,
        fortifiedScaler: 1.0, ccResist: 0
    },
    CANNON_FACTORY: { 
        id: 6, name: "cannon factory", property: 1, size: 10, range: 50, attackSpeed: 600, damage: 100, targets: 1,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.PHYSICAL,
        damageTypes: {[DAMAGE_TYPES.PHYSICAL]: 1.0}, penetration: {}, critChance: 0, critDamage: 100,
        fortifiedScaler: 1.0, ccResist: 0
    },
    PIERCE_LASER: { 
        id: 7, name: "pierce laser", property: 2, size: 12.5, range: 100, attackSpeed: 80, damage: 125, targets: 1,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.MAGIC,
        damageTypes: {[DAMAGE_TYPES.MAGIC]: 1.0}, penetration: {}, critChance: 0, critDamage: 100,
        fortifiedScaler: 1.0, ccResist: 0
    },
    SCATTER_CANNON: { 
        id: 8, name: "scatter cannon", property: 1, size: 7.5, range: 80, attackSpeed: 200, damage: 35, targets: 8,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.PHYSICAL,
        damageTypes: {[DAMAGE_TYPES.PHYSICAL]: 1.0}, penetration: {}, critChance: 0, critDamage: 100,
        fortifiedScaler: 1.0, ccResist: 0
    },
    MISSILE: { 
        id: 9, name: "missile", property: 0, size: 0, range: 0, attackSpeed: 0, damage: 0, targets: 0,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.EXPLOSIVE,
        damageTypes: {}, penetration: {}, critChance: 0, critDamage: 100, fortifiedScaler: 1.0, ccResist: 0
    },
    SCATTER_MISSILE: { 
        id: 10, name: "scatter missile", property: 0, size: 0, range: 0, attackSpeed: 0, damage: 0, targets: 0,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.EXPLOSIVE,
        damageTypes: {}, penetration: {}, critChance: 0, critDamage: 100, fortifiedScaler: 1.0, ccResist: 0
    },
    TOXIC_MISSILE: { 
        id: 11, name: "toxic missle", property: 0, size: 0, range: 0, attackSpeed: 0, damage: 0, targets: 0,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.POISON,
        damageTypes: {}, penetration: {}, critChance: 0, critDamage: 100, fortifiedScaler: 1.0, ccResist: 0
    },
    SHOCK_MISSILE: { 
        id: 12, name: "shock missle", property: 0, size: 0, range: 0, attackSpeed: 0, damage: 0, targets: 0,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.ELECTRICAL,
        damageTypes: {}, penetration: {}, critChance: 0, critDamage: 100, fortifiedScaler: 1.0, ccResist: 0
    },
    LEGEND_1: { 
        id: 13, name: "legend 1", property: 0, size: 0, range: 0, attackSpeed: 0, damage: 0, targets: 0,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.TRUE,
        damageTypes: {}, penetration: {}, critChance: 0, critDamage: 100, fortifiedScaler: 1.0, ccResist: 0
    },
    LEGEND_2: { 
        id: 14, name: "legend 2", property: 0, size: 0, range: 0, attackSpeed: 0, damage: 0, targets: 0,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.TRUE,
        damageTypes: {}, penetration: {}, critChance: 0, critDamage: 100, fortifiedScaler: 1.0, ccResist: 0
    },
    LEGEND_3: { 
        id: 15, name: "legend 3", property: 0, size: 0, range: 0, attackSpeed: 0, damage: 0, targets: 0,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.TRUE,
        damageTypes: {}, penetration: {}, critChance: 0, critDamage: 100, fortifiedScaler: 1.0, ccResist: 0
    },
    LEGEND_4: { 
        id: 16, name: "legend 4", property: 0, size: 0, range: 0, attackSpeed: 0, damage: 0, targets: 0,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.TRUE,
        damageTypes: {}, penetration: {}, critChance: 0, critDamage: 100, fortifiedScaler: 1.0, ccResist: 0
    },
    MOVING_CANNON: { 
        id: 17, name: "moving cannon", property: 1, size: 4.8, range: 50, attackSpeed: 5, damage: 2, targets: 1,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.PHYSICAL,
        damageTypes: {[DAMAGE_TYPES.PHYSICAL]: 1.0}, penetration: {}, critChance: 0, critDamage: 100,
        fortifiedScaler: 1.0, ccResist: 0
    },
    PELLET: { 
        id: 18, name: "pellet", property: 1, size: 2.5, range: 0, attackSpeed: 0, damage: 35, targets: 0,
        category: TOWER_CATEGORIES.DAMAGE, damageFamily: DAMAGE_TYPES.PHYSICAL,
        damageTypes: {[DAMAGE_TYPES.PHYSICAL]: 1.0}, penetration: {}, critChance: 0, critDamage: 100,
        fortifiedScaler: 1.0, ccResist: 0
    },
    BANK: { 
        id: 19, name: "bank", property: 0, size: 5, range: 170, attackSpeed: 250, damage: 0, targets: 0,
        category: TOWER_CATEGORIES.ECON, damageFamily: DAMAGE_TYPES.PHYSICAL,
        damageTypes: {}, penetration: {}, critChance: 0, critDamage: 100, fortifiedScaler: 1.0, ccResist: 0
    }
};

// Building Colors
export const BUILDING_COLORS = {
    0: "#feb1b1",   // cannon
    1: "#ff8080",   // multi cannon
    2: "#ff3636",   // huge cannon
    3: "#b5e2ff",   // laser
    4: "#6ac5fe",   // frost laser
    5: "#3786cb",   // chain laser
    6: "#ff4f4f",   // cannon factory
    6.1: "#ff4f4f", // moving cannon (car)
    7: "#3792cb",   // pierce laser
    8: "#ff5e4f",   // scatter cannon
    8.1: "#ff5e4f", // pellet
    19: "#154f30"   // bank
};

// Projectile Colors
export const PROJECTILE_COLORS = {
    0: { color: "#feb1b1", width: 3 },
    1: { color: "#ff8080", width: 3 },
    2: { color: "#ff3636", width: 10 },
    3: { color: "#b5e2ff", width: 1 },
    4: { color: "#6ac5fe", width: 2 },
    5: { color: "#3786cb", width: 5 },
    6: { color: "#ff4f4f", width: 2.5 },
    6.1: { color: "#ff4f4f", width: 2.5 },
    7: { color: "#3792cb", width: 7.5 }
};

// Purchase Costs
export const PURCHASE_COSTS = {
    CANNON: 0,
    MULTI_CANNON: 300,
    CANNON_FACTORY: 1200,
    HUGE_CANNON: 1600,
    LASER: 675,
    FROST_LASER: 1250,
    PIERCE_LASER: 2000,
    CHAIN_LASER: 2400,
    KILL_RANDOM: 50,
    SLOW_ALL: 100,
    SCATTER_CANNON: 800,
    BANK: 500,
    UPGRADE_CANNONS: 2500,
    UPGRADE_LASERS: 2500,
    UPGRADE_MISSILES: 2500,
    UPGRADE_UTILITY: 2500
};

// Cost Increments
export const COST_INCREMENTS = {
    CANNON: 125,
    MULTI_CANNON: 400,
    CANNON_FACTORY: 800,
    HUGE_CANNON: 1200,
    LASER: 450,
    FROST_LASER: 1750,
    CHAIN_LASER: 2400,
    PIERCE_LASER: 2500,
    SCATTER_CANNON: 800,
    BANK: 100,
    UPGRADE: 2500
};

