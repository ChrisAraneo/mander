export type { Action } from './state/types/action';
export type { Clock } from './state/types/clock';
export type { RecordableAction } from './state/types/recordable-action';
export type { GameLevel } from './state/types/game-level';
export type { GameWorld } from './state/types/game-world';
export { isOverlappingSpike } from './spike/is-overlapping-spike';
export {
  BULLET_SIZE,
  BULLET_SPEED,
  BULLET_HITBOX_INSET,
  BULLET_MUZZLE_RATIO,
  BASE_AMMO,
} from './bullet/consts';
export { nextBullets } from './bullet/next-bullets';
export { createFiredBullet } from './bullet/create-fired-bullet';
export { isHittingEnemy } from './bullet/is-hitting-enemy';
export { computeVolley } from './bullet/compute-volley';
export { computeStartingAmmo } from './bullet/compute-starting-ammo';
export type { Volley } from './bullet/types/volley';
export {
  CANNON_RELOAD_SECONDS,
  CANNON_AIM_SECONDS,
  CANNON_RESTING_ANGLE,
  TRIPLE_CANNON_RELOAD_SECONDS,
  TRIPLE_CANNON_SHOT_GAP_SECONDS,
  TRIPLE_CANNON_SPREAD_RADIANS,
  CANNON_BARREL_TURN_SPEED,
  CANNON_RANGE_TILES,
  CANNON_RANGE,
  CANNONBALL_SIZE,
  CANNONBALL_SPEED,
  CANNONBALL_HITBOX_INSET,
} from './cannon/consts';
export { nextCannonballs } from './cannon/next-cannonballs';
export { nextCannons } from './cannon/next-cannons';
export { createCannons } from './cannon/create-cannons';
export { createFiredCannonball } from './cannon/create-fired-cannonball';
export { isTouchingCannonball } from './cannon/is-touching-cannonball';
export type { Barrage } from './cannon/types/barrage';
export {
  SNOWBALL_SIZE,
  SNOWBALL_SPEED,
  SNOWBALL_HITBOX_INSET,
} from './snowball/consts';
export { nextSnowballs } from './snowball/next-snowballs';
export { isTouchingSnowball } from './snowball/is-touching-snowball';
export { filterChillingSnowballs } from './snowball/filter-chilling-snowballs';
export {
  FALLING_SPIKE_TRIGGER_TILES,
  FALLING_SPIKE_TRIGGER_RANGE,
  FALLING_SPIKE_TRIGGER_DEPTH_TILES,
  FALLING_SPIKE_TRIGGER_DEPTH,
  FALLING_SPIKE_WIDTH,
  FALLING_SPIKE_HEIGHT,
  FALLING_SPIKE_INSET_X,
  FALLING_SPIKE_PIT_TILES,
} from './falling-spike/consts';
export { nextFallingSpikes } from './falling-spike/next-falling-spikes';
export { createFallingSpikes } from './falling-spike/create-falling-spikes';
export { isTouchingFallingSpike } from './falling-spike/is-touching-falling-spike';
export { nextFallingSpike } from './falling-spike/next-falling-spike';
export {
  FIREBALL_ORBIT_TILES,
  FIREBALL_ORBIT_RADIUS,
  FIREBALL_ORBIT_SECONDS,
  FIREBALL_ANGULAR_SPEED,
  FIREBALL_SIZE,
  FIREBALL_HITBOX_INSET,
  FIREBALL_STAGGER_STEPS,
  FIREBALL_STAGGER_ANGLE,
  FIREBALL_ANTICLOCKWISE_CHANCE,
  PINKBALL_LOOPS,
  PINKBALL_LOOP_RADIUS,
  PINKBALL_SPEED_SCALE,
  PINKBALL_LOOP_SECONDS,
  PINKBALL_ANGULAR_SPEED,
} from './fireball/consts';
export { nextFireballs } from './fireball/next-fireballs';
export { createFireballs } from './fireball/create-fireballs';
export { computeFireballPosition } from './fireball/compute-fireball-position';
export { isBurning } from './fireball/is-burning';
export { isFreezing } from './fireball/is-freezing';
export { isIceball } from './fireball/is-iceball';
export { isTouchingFireball } from './fireball/is-touching-fireball';
export { nextFireball } from './fireball/next-fireball';
export {
  ENEMY_WIDTH,
  ENEMY_HEIGHT,
  ENEMY_HITBOX_INSET,
  STOMP_GRACE_X,
  STOMP_GRACE_Y,
  ENEMY_MOVE_SPEED,
  ENEMY_JUMP_VELOCITY,
  HORNED_ENEMY_JUMP_VELOCITY,
  ENEMY_DEATH_SECONDS,
  HORNED_ENEMY_CHANCE,
  FAST_ENEMY_MOVE_SPEED,
  FAST_ENEMY_CHANCE,
  SHOOTER_ENEMY_MOVE_SPEED,
  SHOOTER_ENEMY_CHANCE,
  SHOOTER_RELOAD_SECONDS,
  SHOOTER_RANGE,
  FLYING_ENEMY_MOVE_SPEED,
  FLYING_ENEMY_RANGE,
  BEARTRAP_TRIGGER_TILES,
  BEARTRAP_TRIGGER_RANGE,
  BEARTRAP_JUMP_TILES,
  BEARTRAP_JUMP_VELOCITY,
  FREEZING_ENEMY_MOVE_SPEED,
  FREEZING_ENEMY_CHANCE,
  FREEZING_RELOAD_SECONDS,
  FREEZING_RANGE,
} from './enemy/consts';
export { createEnemies } from './enemy/create-enemies';
export { patchCrushedEnemies } from './enemy/patch-crushed-enemies';
export { isOverlappingEnemy } from './enemy/is-overlapping-enemy';
export { isPlayerNearTrap } from './enemy/is-player-near-trap';
export { nextBeartrap } from './enemy/next-beartrap';
export { nextEnemy } from './enemy/next-enemy';
export { nextShooters } from './enemy/next-shooters';
export { nextFreezers } from './enemy/next-freezers';
export type { Salvo } from './enemy/types/salvo';
export type { Blizzard } from './enemy/types/blizzard';
export { createBasePlayerVelocity } from './player/create-base-player-velocity';
export {
  PLAYER_WIDTH_TILES,
  PLAYER_HEIGHT_TILES,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_MAX_MOVE_VELOCITY,
  PLAYER_MAX_JUMP_VELOCITY,
  PLAYER_HITBOX_INSET_X,
  PLAYER_HITBOX_INSET_TOP,
  PLAYER_HITBOX_INSET_BOTTOM,
  PLAYER_DEATH_SECONDS,
  PLAYER_DEATH_LAUNCH_VELOCITY,
  STOMP_BOUNCE_VELOCITY,
  BASE_HEARTS,
  HURT_INVINCIBLE_SECONDS,
  HURT_FLASH_SECONDS,
  STAR_INVINCIBLE_SECONDS,
  COLD_SECONDS,
  COLD_MOVE_FACTOR,
  COLD_JUMP_HEIGHT_FACTOR,
  COLD_JUMP_VELOCITY_FACTOR,
  ACCELERATION_SECONDS,
  ICE_ACCELERATION_SECONDS,
  ICE_PROBE_DEPTH,
} from './player/consts';
export { createPlayer } from './player/create-player';
export { isAlive } from './player/is-alive';
export { computePlayerCentre } from './player/compute-player-centre';
export { computeSpawnPosition } from './player/compute-spawn-position';
export { computeStartingHearts } from './player/compute-starting-hearts';
export { nextPlayer } from './player/next-player';
export { isCold } from './player/is-cold';
export { isFalling } from './player/is-falling';
export { getPlayerMoveVelocity } from './player/get-player-move-velocity';
export { getPlayerJumpVelocity } from './player/get-player-jump-velocity';
export { patchChilledPlayer } from './player/patch-chilled-player';
export { patchColdPlayer } from './player/patch-cold-player';
export { patchFrozenPlayer } from './player/patch-frozen-player';
export { computePlayerReach } from './reach/compute-player-reach';
export { isReachableCell } from './reach/is-reachable-cell';
export type { ReachMap } from './reach/types/reach-map';
export { nextGameState } from './game/next-game-state';
export {
  LEVEL_SCORE_BASE,
  LEVEL_SCORE_PER_SECOND,
  LEVEL_SCORE_MIN,
} from './score/consts';
export { GEM_SCORE } from './score/consts';
export { computeLevelScore } from './score/compute-level-score';
export { getBulletsAmount } from './item/get-bullets-amount';
export { getScoreAmount } from './item/get-score-amount';
export { patchShot } from './shoot/patch-shot';
export { getStarsAmount } from './item/get-stars-amount';
export { isStar } from './use-star/is-star';
export { computeStartingStars } from './use-star/compute-starting-stars';
export { patchStarUse } from './use-star/patch-star-use';
export { computeTotalTime } from './score/compute-total-time';
export { patchGameState } from './game/patch-game-state';
export { ACTION_CODES } from './pack/action-codes';
export { findActionCode } from './pack/find-action-code';
export { serializeReplay } from './pack/serialize-replay';
export type { PackedReplay } from './pack/types/packed-replay';
export type { PackedEntry } from './pack/types/packed-entry';
export { parseReplay } from './pack/parse-replay';
export { nextPlayback } from './playback/next-playback';
export { createPlayback } from './playback/create-playback';
export { isReplayFinished } from './playback/is-replay-finished';
export { computeReplayDuration } from './playback/compute-replay-duration';
export { computeReplayProgress } from './playback/compute-replay-progress';
export type { ReplayPlayback } from './playback/types/replay-playback';
export { createRecorder } from './recorder/create-recorder';
export { addRecordedAction } from './recorder/add-recorded-action';
export { finishRecording } from './recorder/finish-recording';
export { toReplay } from './recorder/to-replay';
export { createEmptyReplay } from './recorder/create-empty-replay';
export type { RecordedAction } from './recorder/types/recorded-action';
export type { RecorderState } from './recorder/types/recorder-state';
export type { Replay } from './recorder/types/replay';
export { createInitialState } from './start/create-initial-state';
export type { GameState } from './state/types/game-state';
export type { GameStatus } from './state/types/game-status';
export type { InputState } from './state/types/input-state';
