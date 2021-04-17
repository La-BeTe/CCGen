export default function (...args: number[]) {
    const result = args.reduce((a, b) => a + b, 0);
    return result;
}
