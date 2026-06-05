/**
 * Khu vực cho dropdown Hero + filter (spec §2.2.3).
 * Gồm quận TP.HCM + Hà Nội + Đà Nẵng + Hải Phòng + Cần Thơ.
 * `slug` dùng làm query param ?area=...
 */
export type AreaOption = { slug: string; label: string };
export type AreaGroup = { city: string; options: AreaOption[] };

export const AREA_GROUPS: AreaGroup[] = [
  {
    city: 'TP. Hồ Chí Minh',
    options: [
      { slug: 'q1', label: 'Quận 1' },
      { slug: 'q3', label: 'Quận 3' },
      { slug: 'q5', label: 'Quận 5' },
      { slug: 'q7', label: 'Quận 7' },
      { slug: 'binh-thanh', label: 'Bình Thạnh' },
      { slug: 'phu-nhuan', label: 'Phú Nhuận' },
      { slug: 'thu-duc', label: 'TP. Thủ Đức' },
      { slug: 'go-vap', label: 'Gò Vấp' },
    ],
  },
  {
    city: 'Hà Nội',
    options: [
      { slug: 'hoan-kiem', label: 'Hoàn Kiếm' },
      { slug: 'ba-dinh', label: 'Ba Đình' },
      { slug: 'cau-giay', label: 'Cầu Giấy' },
      { slug: 'dong-da', label: 'Đống Đa' },
      { slug: 'hai-ba-trung', label: 'Hai Bà Trưng' },
      { slug: 'tay-ho', label: 'Tây Hồ' },
    ],
  },
  {
    city: 'Đà Nẵng',
    options: [
      { slug: 'hai-chau', label: 'Hải Châu' },
      { slug: 'son-tra', label: 'Sơn Trà' },
      { slug: 'ngu-hanh-son', label: 'Ngũ Hành Sơn' },
    ],
  },
  {
    city: 'Hải Phòng',
    options: [
      { slug: 'hp-le-chan', label: 'Lê Chân' },
      { slug: 'hp-ngo-quyen', label: 'Ngô Quyền' },
    ],
  },
  {
    city: 'Cần Thơ',
    options: [
      { slug: 'ct-ninh-kieu', label: 'Ninh Kiều' },
      { slug: 'ct-cai-rang', label: 'Cái Răng' },
    ],
  },
];

/** Flatten cho lookup nhanh */
export const ALL_AREAS: AreaOption[] = AREA_GROUPS.flatMap((g) => g.options);
