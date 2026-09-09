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
