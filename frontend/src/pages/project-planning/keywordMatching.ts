const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function distance(left: string, right: string): number {
    let row = Array.from({ length: right.length + 1 }, (_, index) => index);
    for (let i = 0; i < left.length; i++) {
        const next = [i + 1];
        for (let j = 0; j < right.length; j++) {
            next.push(Math.min(next[j] + 1, row[j + 1] + 1, row[j] + (left[i] === right[j] ? 0 : 1)));
        }
        row = next;
    }
    return row[right.length];
}

export function matchKeywords(input: string, keywords: string[]): string[] {
    const query = normalize(input);
    if (!query) return [];
    const exact = keywords.filter((keyword) => normalize(keyword) === query);
    if (exact.length) return exact;
    if (query.length < 3) return [];
    const partial = keywords.filter((keyword) => normalize(keyword).includes(query));
    if (partial.length) return partial;
    const scored = keywords.map((keyword) => {
        const normalized = normalize(keyword);
        return { keyword, score: Math.min(...[normalized, ...normalized.split(" ")].map((candidate) => distance(query, candidate))) };
    });
    const best = Math.min(...scored.map(({ score }) => score));
    const tolerance = query.length >= 6 ? 2 : 1;
    return best <= tolerance ? scored.filter(({ score }) => score === best).map(({ keyword }) => keyword) : [];
}
