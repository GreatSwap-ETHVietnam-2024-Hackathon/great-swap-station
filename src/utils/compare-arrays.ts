export function are2ArraysEqual<Q>(a: Q[], b: Q[], attribute?: string, sortFunction?: (x: any, y: any) => number) {
    if (a.length !== b.length) return false;
    const sortedA = a.sort(sortFunction);
    const sortedB = b.sort(sortFunction);
    if (!attribute) return sortedA.reduce((acc, e, index) => { return acc && e === sortedB[index] }, true);
    else return sortedA.reduce((acc, e: any, index) => { return acc && e[attribute] === (sortedB[index] as any)[attribute] }, true);
}