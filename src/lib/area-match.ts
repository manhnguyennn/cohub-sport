import { AREA_GROUPS } from '@/data/areas';

/** Bỏ dấu tiếng Việt + lowercase */
function strip(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').trim();
}

/** Chuẩn hoá tên thành phố về key thống nhất (xử lý 'TP.HCM' vs 'TP. Hồ Chí Minh') */
export function cityKey(name: string): string {
  const s = strip(name);
  if (s.includes('hcm') || s.includes('ho chi minh') || s.includes('sai gon')) return 'hcm';
  if (s.includes('ha noi')) return 'hanoi';
  if (s.includes('da nang')) return 'danang';
  if (s.includes('hai phong')) return 'haiphong';
  if (s.includes('can tho')) return 'cantho';
  if (s.includes('nha trang')) return 'nhatrang';
  if (s.includes('ha long')) return 'halong';
  return s.replace(/[^a-z0-9]/g, '');
}

/** slug khu vực → { cityKey, districtKey } */
const AREA_LOOKUP: Record<string, { cityKey: string; districtKey: string }> = (() => {
  const map: Record<string, { cityKey: string; districtKey: string }> = {};
  for (const g of AREA_GROUPS) {
    const ck = cityKey(g.city);
    for (const o of g.options) map[o.slug] = { cityKey: ck, districtKey: strip(o.label) };
  }
  return map;
})();

/**
 * Coach có khớp các khu vực đã chọn không.
 * Khớp ở mức city (chọn quận nào của 1 thành phố → ra coach thành phố đó),
 * vẫn ưu tiên district nếu trùng chính xác.
 */
export function matchesArea(
  areaCsv: string,
  loc: { city: string; district?: string },
): boolean {
  const slugs = areaCsv.split(',').map((s) => s.trim()).filter(Boolean);
  if (slugs.length === 0) return true;
  const wantCities = new Set<string>();
  const wantDistricts = new Set<string>();
  for (const slug of slugs) {
    const e = AREA_LOOKUP[slug];
    if (e) { wantCities.add(e.cityKey); wantDistricts.add(e.districtKey); }
  }
  if (wantCities.size === 0) return true;
  const ck = cityKey(loc.city);
  const dk = loc.district ? strip(loc.district) : '';
  return wantCities.has(ck) || (dk !== '' && wantDistricts.has(dk));
}
