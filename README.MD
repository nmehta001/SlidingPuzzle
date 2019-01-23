# Sliding Puzzle

### Language
Written in JavaScript for ease of sharing, easily executable on everything

### Known issues
It does not check the rest of the pieces correctly only A

### Rationale

I took the problem and created data structures for both the pieces and their position relative to the top left co-ordinate on the board.

In order to check for whether a piece could make a move, the edges for the moved piece were compared to the edges of a piece that may be occupying the same space. If it did then there was no valid move for that piece to make. The new piece would then be added to the state if it was a valid move or the original position would be restored from the previous state.

I then created a few collections to help manage the state of the board as we would be recursively calling a method to get the possible moves for a given state.

This would be done by tracking the previous and current state of the board. Another collection was used to hold previously seen before board states. If the state existed in the collection the recursion would not continue.


### Assumptions
None made

### How to run
Open the ```main.html``` file and the collection should print to the console.