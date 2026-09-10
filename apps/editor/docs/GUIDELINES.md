# Editor Guidelines

## Jumps over gaps

Five tiles across and one tile up:

```
__, __, __, __, __, __, DR
DR, __, __, __, __, __, DR
```

Four tiles across and two tiles up:

```
__, __, __, __, __, DR
__, __, __, __, __, DR
DR, __, __, __, __, DR
```

Four tiles across and three tiles up:

```
__, __, __, __, __, DR
__, __, __, __, __, DR
__, __, __, __, __, DR
DR, __, __, __, __, DR
```

Three tiles across and four tiles up:

```
__, __, __, __, DR
__, __, __, __, DR
__, __, __, __, DR
__, __, __, __, DR
DR, __, __, __, DR
```

# Jumps over gaps with ceiling

```
[__, __, __, __, __, __, DR, DR, DR, DR, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, DR, __, __, DR, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, DR, __, __, DR, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, DR, __, __, DR, __, __, __, __, __, __, __, __, __, __],
```

```
[__, __, __, __, __, __, DR, DR, DR, DR, DR, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, DR, __, __, __, DR, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, DR, __, __, __, DR, __, __, __, __, __, __, __, __, __],
```

# Jumps over spikes

Max jump over spikes:

```
[__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, SP, SP, SP, SP, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, DR, DR, DR, DR, DR, DR, __, __, __, __, __, __, __, __],
```

# Jumps over spikes with ceiling

Max jump over spikes with ceiling above:

```
[__, __, __, __, __, __, DR, DR, DR, DR, DR, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, SP, SP, __, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, DR, DR, DR, DR, DR, __, __, __, __, __, __, __, __, __],
```

# The two layers

A sector is written as two grids: the front, which the level is played against,
and the back, drawn dimmed and flattened behind it with no border. The player
passes straight through the back layer — nothing lands on it and no hazard is
anchored by it — so the same cell can hold a spike in front and a brick wall
behind:

```ts
export const NORMAL_001: Structure = [
  [
    [__, __, __, __, __],
    [__, SP, __, BT, __],
    [DR, DR, DR, DR, DR],
  ],
  [
    [BR, BR, BR, BR, BR],
    [BR, BR, BR, BR, BR],
    [__, __, __, __, __],
  ],
];
```

A sector with nothing painted behind it leaves its back layer empty:

```ts
export const NORMAL_002: Structure = [
  [
    [__, __, __, __, __],
    [DR, DR, DR, DR, DR],
  ],
  [],
];
```

The back layer takes blocks alone. A hazard, an enemy, or a start or end marker
belongs on the front, and the editor will say so.

Both layers are painted on the one canvas. The Background brush group paints
into the back layer and the right button erases from whichever layer the brush
belongs to, so a background brush rubs out background and leaves the level in
front of it alone.

The generator keeps the layers apart the whole way through: the spawn, the
portal, the key, the chest and the gems are all placed against the front layer,
and what is painted behind stays behind them.

# Vertical sectors

A vertical sector is 20 × 22, four rows taller than a normal one, and the
generator stacks the pool upwards instead of laying it across. Sectors overlap by
the block they are joined at: the end block of one sector is the start block of
the one above it, so a climb of `n` sectors is `n * 21 + 1` rows tall.

```
row  0   the shaft the player leaves through — empty, with the end (99) at column 9
row  1   the ledge it leaves from — a platform of at least one block from column 9
rows 2-17 the climb, no platform more than three rows of air above the one below
row 18   the ledge the player lands on, across columns 3-6 or 13-16, with columns
         8-11 left open so the sector below can be jumped out of
rows 19-21 the hall the player arrives in — empty, with the start (98) at column 9
```

```
[__, __, __, __, __, __, __, __, __, EE, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, __, __, DR, DR, DR, __, __, __, __, __, __, __, __],
...
[__, __, __, DR, DR, DR, DR, __, __, __, __, __, __, DR, DR, DR, DR, __, __, __],
[__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
[__, __, __, __, __, __, __, __, __, SS, __, __, __, __, __, __, __, __, __, __],
```

A step the player can only take from a single column is a step it usually cannot
take: the sector below decides how it comes off its ledge, and the sector above
puts a ceiling over the jump. Leave two columns of footing on either side of
every step.
