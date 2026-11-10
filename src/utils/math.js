export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const lerp = (a, b, t) => a + (b-a) * t;
export const distance2 = (a,b) => Math.hypot(a.x-b.x, a.z-b.z);
export const seedRandom = (seed) => {
  let a = (seed >>> 0) || 1;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
export const formatNumber = n => new Intl.NumberFormat('pt-BR').format(Math.floor(n));
