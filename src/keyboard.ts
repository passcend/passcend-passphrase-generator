
// Adjacency graph for QWERTY keyboard (lower case)
// We consider horizontal and strictly vertical neighbors.
// Diagonal neighbors are often also considered in zxcvbn, but let's start with direct neighbors + slight slant for standard typing.
// Actually, standard zxcvbn uses an adjacency graph.
// Let's define the rows and build adjacency from them.

const QWERTY_ROWS = [
    "`1234567890-=",
    "qwertyuiop[]\\",
    "asdfghjkl;'",
    "zxcvbnm,./"
];

// We can also support shifted characters by mapping them back to unshifted
const SHIFT_MAP: { [key: string]: string } = {
    '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-', '+': '=',
    'Q': 'q', 'W': 'w', 'E': 'e', 'R': 'r', 'T': 't', 'Y': 'y', 'U': 'u', 'I': 'i', 'O': 'o', 'P': 'p', '{': '[', '}': ']', '|': '\\',
    'A': 'a', 'S': 's', 'D': 'd', 'F': 'f', 'G': 'g', 'H': 'h', 'J': 'j', 'K': 'k', 'L': 'l', ':': ';', '"': "'",
    'Z': 'z', 'X': 'x', 'C': 'c', 'V': 'v', 'B': 'b', 'N': 'n', 'M': 'm', '<': ',', '>': '.', '?': '/'
};

interface AdjacencyGraph {
    [char: string]: string[]; // list of adjacent characters
}

function buildAdjacencyGraph(): AdjacencyGraph {
    const graph: AdjacencyGraph = {};

    // Helper to add edge
    const addEdge = (u: string, v: string) => {
        if (!graph[u]) graph[u] = [];
        if (!graph[v]) graph[v] = [];
        if (!graph[u].includes(v)) graph[u].push(v);
        if (!graph[v].includes(u)) graph[v].push(u);
    };

    // Horizontal adjacency
    for (const row of QWERTY_ROWS) {
        for (let i = 0; i < row.length - 1; i++) {
            addEdge(row[i], row[i+1]);
        }
    }

    // Vertical/Diagonal adjacency (visual approximation)
    // 1 2 3 4 ...
    //  q w e r ...
    //   a s d f ...
    //    z x c v ...

    // Mapping visually based on standard offset
    // q is below 1, w is below 2 (roughly) - actually q is between 1 and 2.
    // For simplicity, let's look at "standard" touch typing mappings or just coordinate based.
    // Let's use a coordinate system.
    // Row 0 starts at x=0
    // Row 1 starts at x=1.5 (approx) -> standard keyboard has row stagger.
    // Let's simplify:
    // 1-q, 2-w, 3-e ... is often considered adjacent.
    // Also q-a, w-s, e-d ...
    // Also a-z, s-x, d-c ...

    // Vertical connections (column-wise approximation)
    const verticalPairs = [
        ['1', 'q', 'a', 'z'],
        ['2', 'w', 's', 'x'],
        ['3', 'e', 'd', 'c'],
        ['4', 'r', 'f', 'v'],
        ['5', 't', 'g', 'b'],
        ['6', 'y', 'h', 'n'],
        ['7', 'u', 'j', 'm'],
        ['8', 'i', 'k', ','],
        ['9', 'o', 'l', '.'],
        ['0', 'p', ';', '/'],
        ['-', '[', "'"],
        ['=', ']']
    ];

    for (const col of verticalPairs) {
        for (let i = 0; i < col.length - 1; i++) {
            addEdge(col[i], col[i+1]);
        }
    }

    // Also handle diagonals that are very close?
    // zxcvbn uses a more complex graph, but for this library, horizontal + vertical/stacked is a good start.
    // The user specifically mentioned "qwerty", "qazwsx" (which is q-a-z w-s-x interleaved?), "asdf".

    return graph;
}

const ADJACENCY_GRAPH = buildAdjacencyGraph();

/**
 * Checks for keyboard spatial patterns.
 * Returns an array of detected pattern descriptions.
 * @param password The password to check
 */
export function checkKeyboardPatterns(password: string): string[] {
    if (!password || password.length < 3) return [];

    const warnings: string[] = [];
    const lowerPassword = password.split('').map(c => SHIFT_MAP[c] || c.toLowerCase()).join('');

    // Check for sequences of length >= 3 in the graph
    // We look for a path in the graph.
    // Actually, simpler: check if p[i+1] is adjacent to p[i], and p[i+2] is adjacent to p[i+1]...
    // And direction should be consistent?
    // "qwerty" -> q-w (horiz), w-e (horiz), e-r (horiz)... Consistent horizontal.
    // "qaz" -> q-a (vert), a-z (vert). Consistent vertical.
    // "qazwsx" -> q-a-z (vert), z-w (jump?) No, qazwsx is usually typed column by column?
    // Actually "qazwsx" is q-a-z then w-s-x. That's not a single connected chain in a simple adjacency graph unless we consider neighbors.
    // But usually simple pattern matchers look for contiguous substrings that follow a line.

    // Let's focus on contiguous substrings that are adjacent in the graph.

    let currentSequenceLen = 1;
    let patternFound = false;

    // We need to differentiate direction to avoid "zigzag" unless that's intended.
    // Usually "qwerty" is a pattern because it follows a line.
    // "qwaes z..." is zigzag.
    // For now, let's just detect generic adjacency chains of length >= 3 (or 4?). zxcvbn uses 3.

    // However, "qwe" is very common. Let's flag >= 4 or strictly >= 3?
    // User examples: "qwerty" (6), "qazwsx" (6), "asdf" (4).
    // Let's stick to >= 4 for high confidence, or 3 for stricter warnings. Let's go with 3.

    // We iterate and check if char[i] and char[i+1] are adjacent.
    for (let i = 0; i < lowerPassword.length - 1; i++) {
        const c1 = lowerPassword[i];
        const c2 = lowerPassword[i+1];

        if (areAdjacent(c1, c2)) {
            currentSequenceLen++;
        } else {
            if (currentSequenceLen >= 3) {
                // Found a pattern
                patternFound = true;
            }
            currentSequenceLen = 1;
        }

        if (currentSequenceLen >= 3) patternFound = true;
    }

    if (patternFound) {
        warnings.push("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
    }

    return [...new Set(warnings)];
}

function areAdjacent(c1: string, c2: string): boolean {
    if (c1 === c2) return false; // Repeats are handled elsewhere
    return ADJACENCY_GRAPH[c1]?.includes(c2) || false;
}
