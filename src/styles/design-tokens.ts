/**
 * CoHub Design Tokens v2
 * ──────────────────────────────────────────────────────────────
 * Tổng hợp từ: CoHub v1 + Linear (precision/shadow) +
 * Claude (warm neutrals / interaction) + Professional Blue (hierarchy)
 *
 * Thay đổi so với v1:
 *  COLOR    — Bỏ pure #000/#fff, tinted neutrals, gộp 6 blues → 4 roles,
 *              thêm background hierarchy, alpha, semantic roles
 *  TYPE     — 13 sizes → 9 sizes, bỏ Alt duplicates, thêm lineHeight per size
 *  SPACING  — Thêm space-9 (36px) + space-16 (64px), thêm semantic aliases
 *  RADIUS   — 8 values → 6 values + cleaner component rules
 *  SHADOW   — Multi-layer (Linear pattern), thêm focus-ring + overlay
 *  ANIMATION — Bỏ bounce spring, thêm expo + standard easing
 *
 * Sync với _tokens.scss — cập nhật cả hai khi thay đổi
 */

// ─── COLOR ─────────────────────────────────────────────────────────────────
//
// Nguyên tắc CoHub:
//   Brand blue (#1A2ADF) là màu chủ — CTA, link, trạng thái active
//   Gradient blue→pink là điểm nhận dạng thương hiệu — dùng cho accent, không phải nền
//   Neutral có blue undertone nhẹ — tránh cảm giác generic "AI gray"
//   Không dùng #000000 hay #FFFFFF thuần

export const color = {

  // ── Brand ──────────────────────────────────────────────────
  // 4 vai trò rõ ràng, không còn 6 blues chồng chéo
  brand: {
    default:  '#1A2ADF',   // CTA chính, active state, link
    hover:    '#0E1A8F',   // Button hover, pressed
    subtle:   '#5C78FF',   // Secondary actions, lighter accent
    tint:     '#EEF2FF',   // Background nhẹ: badge bg, selected row
    deep:     '#062E97',   // Dark sections: stats, heavy bg
    gradient: 'linear-gradient(135deg, #5F71FF 0%, #0050FF 100%)', // Button CTA
  },

  // ── Accent (signature gradient + sports green) ─────────────
  accent: {
    gradientH:  'linear-gradient(90deg, #0050FF 0%, #D14DDA 92.79%)', // Text gradient, hero badge
    gradientV:  'linear-gradient(180deg, #5F71FF 0%, #0050FF 100%)',  // Button fill
    pink:       '#D14DDA',   // Gradient endpoint
    pinkLight:  '#F566FF',   // Badge NEW background
    green:      '#2EB16F',   // Sports category, success tint
    greenBright:'#42DC8F',   // Feature hero highlight text
  },

  // ── Semantic ────────────────────────────────────────────────
  semantic: {
    success:      '#16A34A',   // Darker green — higher contrast than #22C55E
    successLight: '#DCFCE7',   // Success bg tint
    danger:       '#DC2626',   // Darker red — higher contrast
    dangerLight:  '#FEE2E2',   // Danger bg tint
    warning:      '#D97706',   // Darker amber — higher contrast
    warningLight: '#FEF3C7',   // Warning bg tint
    info:         '#0066CC',   // Pro Blue ref — better platform blue
    infoLight:    '#EBF5FF',   // Info bg tint
  },

  // ── Neutral — tinted với blue undertone nhẹ ─────────────────
  // Thay vì gray thuần (#4B5563), dùng blue-tinted (#44546A)
  // Cảm giác coherent với brand, tránh "AI gray" generic
  neutral: {
    ink:       '#0A0F1E',   // Heading, primary text (không phải #090F14 thuần)
    primary:   '#1C2333',   // Body text chính
    secondary: '#44546A',   // Body text phụ, description
    muted:     '#6B7A99',   // Caption, supporting text
    placeholder:'#9AAABB',  // Input placeholder
    disabled:  '#C4CEDB',   // Disabled text
    border:    '#DDE3EE',   // Border mặc định (blue tint)
    borderHover:'#B8C4D9',  // Border hover state
    divider:   '#EEF1F8',   // Divider line, subtle separator
    surface:   '#F5F7FF',   // Card bg, input bg (blue tint)
    surfaceHover:'#EEF2FF', // Hover bg
    bgBase:    '#FAFBFF',   // Page background (không phải trắng thuần)
    bgSubtle:  '#F5F7FF',   // Slightly elevated bg
    bgElevated:'#FFFFFF',   // Elevated card, modal
  },

  // ── Dark surfaces (cho Experts, AI section) ─────────────────
  dark: {
    base:    '#0D0A2C',   // Experts section
    deeper:  '#060423',   // AI section start
    navy:    '#153E97',   // AI section end
    overlay: 'rgba(6, 4, 35, 0.6)',  // Modal backdrop
    glass:   'rgba(255,255,255,0.08)', // Glassmorphism card on dark
    glassBorder: 'rgba(255,255,255,0.12)',
  },

  // ── Alpha — cho overlay, hover, focus ring ──────────────────
  alpha: {
    brand5:  'rgba(26, 42, 223, 0.05)',
    brand10: 'rgba(26, 42, 223, 0.10)',
    brand20: 'rgba(26, 42, 223, 0.20)',
    brand30: 'rgba(26, 42, 223, 0.30)',
    black5:  'rgba(0, 0, 0, 0.05)',
    black10: 'rgba(0, 0, 0, 0.10)',
    black20: 'rgba(0, 0, 0, 0.20)',
    white10: 'rgba(255,255,255,0.10)',
    white15: 'rgba(255,255,255,0.15)',
    white20: 'rgba(255,255,255,0.20)',
  },

  // ── Semantic role aliases (cho components dùng) ─────────────
  // Đây là layer trên primitive — component dùng role này, không dùng primitive
  role: {
    // Text
    textPrimary:   '#1C2333',
    textSecondary: '#44546A',
    textMuted:     '#6B7A99',
    textInverse:   '#FAFBFF',
    textBrand:     '#1A2ADF',
    // Background
    bgPage:       '#FAFBFF',
    bgCard:        '#FFFFFF',
    bgSubtle:      '#F5F7FF',
    bgHover:       '#EEF2FF',
    bgActive:      '#E4EAFF',
    // Border
    borderDefault: '#DDE3EE',
    borderHover:   '#B8C4D9',
    borderFocus:   '#1A2ADF',
    borderSubtle:  '#EEF1F8',
    // Interactive
    actionDefault: '#1A2ADF',
    actionHover:   '#0E1A8F',
    actionActive:  '#0A1270',
    actionDisabled:'#9AAABB',
    actionFg:      '#FFFFFF',
  },

} as const;


// ─── TYPOGRAPHY ────────────────────────────────────────────────────────────
//
// Nguyên tắc: Tối đa 5 cấp hierarchy. Adjacent levels chênh ≥20%.
// Từ 13 sizes → 9 sizes. Bỏ Alt variants (h1Alt, h2Alt) và bodyMd (15px — quá gần 16px).
// Mỗi size có lineHeight recommended đi kèm.
//
// Typography ref: Apple SF Pro ratios (snug headlines, relaxed body),
//                 Linear (tight utility labels), Claude (warm readable body)

export const font = {
  family: {
    sans:    '"Inter Display", system-ui, -apple-system, "Segoe UI", sans-serif',
    accent:  '"SVN-Apparat", "Inter Display", system-ui, sans-serif',
    mono:    '"JetBrains Mono", "Fira Code", "Menlo", monospace',
  },

  weight: {
    regular:   400,
    medium:    500,
    semibold:  600,
    bold:      700,
    extrabold: 800,
  },

  // 9 cấp — rõ vai trò, không trùng lặp
  // Mỗi cấp chênh ít nhất ~20% so với cấp liền kề
  size: {
    display: 'clamp(40px, 5.5vw, 56px)', // Hero headline — responsive
    h1:      '40px',                       // Page title
    h2:      '32px',                       // Section title
    h3:      '24px',                       // Subsection, card heading
    lead:    '18px',                       // Intro paragraphs, subheadline
    body:    '16px',                       // Default body text
    sm:      '14px',                       // Labels, nav, secondary text
    xs:      '12px',                       // Tags, captions, meta
    xxs:     '10px',                       // Badges, timestamps
  },

  // Line height đi kèm với size — theo tỉ lệ Apple/Airbnb
  lineHeight: {
    display: 1.1,    // Tight for large headlines
    h1:      1.2,
    h2:      1.25,
    h3:      1.3,
    lead:    1.55,   // Comfortable for intros
    body:    1.6,    // Optimal reading rhythm (Claude ref: 1.6)
    sm:      1.5,
    xs:      1.4,
    xxs:     1.2,
  },

  // Letter spacing — quan trọng không kém font-size
  letterSpacing: {
    display: '-0.03em',  // Large headlines — slightly tighter
    heading: '-0.02em',  // h1/h2
    body:    '-0.005em', // Body — slight tightening (Linear ref)
    label:   '0em',      // Labels, nav
    caps:    '0.06em',   // ALL CAPS labels, section headers
  },
} as const;


// ─── SPACING ───────────────────────────────────────────────────────────────
//
// 4px base unit. Scale đầy đủ — không còn gaps.
// Thêm semantic aliases để developer dùng đúng context.

export const space = {
  // Primitive scale
  0:   '0px',
  px:  '1px',
  0.5: '2px',
  1:   '4px',
  1.5: '6px',
  2:   '8px',
  2.5: '10px',
  3:   '12px',
  3.5: '14px',
  4:   '16px',
  5:   '20px',
  6:   '24px',
  7:   '28px',
  8:   '32px',
  9:   '36px',  // ← MỚI: fill gap
  10:  '40px',
  12:  '48px',
  14:  '56px',
  15:  '60px',
  16:  '64px',  // ← MỚI: fill gap
  18:  '72px',  // Header height
  20:  '80px',  // Section padding
  24:  '96px',
  32:  '128px',

  // Semantic aliases — developer dùng này thay primitive
  semantic: {
    pageX:       '24px',   // Horizontal page padding (mobile: 16px)
    pageXWide:   '48px',   // Horizontal page padding (desktop)
    section:     '80px',   // Section padding-block
    sectionSm:   '48px',   // Compact section
    cardPad:     '24px',   // Card padding
    cardPadSm:   '16px',   // Small card padding
    component:   '16px',   // Component internal spacing
    inline:      '8px',    // Inline element gap
    stack:       '12px',   // Vertical stack gap
    form:        '20px',   // Form field gap
  },
} as const;


// ─── BORDER RADIUS ─────────────────────────────────────────────────────────
//
// 8 values → 6 values. Bỏ 6px (tags dùng 4px) và 10px (merge vào 12px).
// Quy tắc gán component rõ ràng — không còn ambiguous.

export const radius = {
  none: '0px',
  xs:   '4px',    // Tags, chips, inline badges
  sm:   '8px',    // Buttons, inputs, small components
  md:   '12px',   // Cards (small), dropdowns, tooltips
  lg:   '16px',   // Cards (default), panels, filter drawers
  xl:   '24px',   // Hero images, large cards, modals
  full: '999px',  // Pills, avatar, progress bar

  // Component aliases
  component: {
    button:   '8px',    // sm
    input:    '8px',    // sm
    card:     '16px',   // lg — platform default
    cardLg:   '24px',   // xl — hero cards, coach featured
    modal:    '20px',   // between lg-xl
    dropdown: '12px',   // md
    tag:      '4px',    // xs
    pill:     '999px',  // full
    avatar:   '999px',  // full
    catCard:  '20px',   // keep existing 20px
  },
} as const;


// ─── SHADOW ────────────────────────────────────────────────────────────────
//
// Pattern từ Linear: multi-layer shadows tạo depth thật hơn single shadow.
// Bỏ blue-tinted shadows khỏi general tokens — chỉ dùng cho button cụ thể.
// Thêm focus-ring và overlay tokens.

export const shadow = {
  // Elevation shadows (Linear multi-layer pattern)
  // xs = subtle lift, sm = card, md = dropdown, lg = modal
  xs:  '0 1px 2px rgba(10,15,30,0.04), 0 1px 1px rgba(10,15,30,0.06)',
  sm:  '0 1px 3px rgba(10,15,30,0.06), 0 2px 6px rgba(10,15,30,0.04)',
  md:  '0 4px 12px rgba(10,15,30,0.08), 0 2px 4px rgba(10,15,30,0.06), 0 1px 1px rgba(10,15,30,0.04)',
  lg:  '0 8px 24px rgba(10,15,30,0.10), 0 4px 8px rgba(10,15,30,0.08), 0 1px 1px rgba(10,15,30,0.04)',
  xl:  '0 16px 48px rgba(10,15,30,0.12), 0 8px 16px rgba(10,15,30,0.08), 0 2px 2px rgba(10,15,30,0.04)',

  // Interactive — brand-tinted (chỉ dùng cho button/active states)
  brandSm: '0 2px 8px rgba(26,42,223,0.20)',
  brandMd: '0 4px 16px rgba(26,42,223,0.30)',
  brandLg: '0 6px 20px rgba(26,42,223,0.35)',

  // Focus ring — WCAG 2.2 compliant
  // Dùng outline: 2px solid + offset thay vì box-shadow khi có thể
  focusRing:       '0 0 0 3px rgba(26,42,223,0.25)',
  focusRingDark:   '0 0 0 3px rgba(92,120,255,0.40)',  // on dark bg

  // Special
  slider: '0 1px 4px rgba(10,15,30,0.12), 0 0 0 1px rgba(10,15,30,0.06)',
  glowBlue: '0 0 60px 20px rgba(0,80,255,0.15)',   // Experts section — toned down từ 380px
} as const;


// ─── LAYOUT ────────────────────────────────────────────────────────────────

export const layout = {
  container:     '1200px',
  containerWide: '1320px',
  containerNarrow: '800px',  // ← MỚI: cho landing content columns
  headerH:       '72px',
  sidebarW:      '280px',    // ← MỚI: CMS/CRM sidebar
  sidebarWNarrow:'220px',
} as const;


// ─── BREAKPOINTS ───────────────────────────────────────────────────────────

export const breakpoint = {
  xs:   '480px',
  sm:   '640px',
  md:   '768px',
  lg:   '1024px',
  xl:   '1200px',
  '2xl':'1440px',
} as const;


// ─── Z-INDEX ───────────────────────────────────────────────────────────────

export const zIndex = {
  base:      0,
  content:   1,
  raised:    10,    // ← MỚI: sticky elements in content
  dropdown:  90,
  sticky:    95,    // ← MỚI: sticky headers in table/list
  header:    100,
  sidebar:   110,   // ← MỚI: CMS sidebar above header on mobile
  modal:     200,
  toast:     300,
  tooltip:   400,   // ← MỚI
} as const;


// ─── ANIMATION ─────────────────────────────────────────────────────────────
//
// Bỏ bounce spring — không dùng overshoot trên platform thương mại.
// Thêm expo easing từ Linear (cảm giác "crisp" và professional hơn).
// Thêm standard easing từ Material Design (general purpose).
// Ref: Linear (50-150ms), Claude (100-200ms), CoHub marketing (200-300ms)

export const animation = {
  duration: {
    instant: '50ms',    // Micro feedback (dropdown appear)
    fast:    '100ms',   // Button hover, icon swap
    normal:  '200ms',   // General transitions (panel, state change)
    slow:    '300ms',   // Sidebar, drawer
    page:    '400ms',   // Page transitions, hero entrance
  },

  easing: {
    // Standard — general purpose smooth (Material Design)
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Expo out — crisp deceleration, dùng cho entrance (Linear ref)
    // Vật thể nặng rơi xuống — tự nhiên và premium hơn ease
    expoOut:  'cubic-bezier(0.16, 1, 0.3, 1)',
    // Quart out — softer than expo, cho content transitions
    quartOut: 'cubic-bezier(0.25, 1, 0.5, 1)',
    // Linear — cho marquee, progress bar
    linear:   'linear',
    // Sine in-out — cho gentle hover effects
    sineInOut:'cubic-bezier(0.45, 0, 0.55, 1)',
    // ❌ KHÔNG DÙNG bounce: cubic-bezier(0.34, 1.56, 0.64, 1)
    //    Bounce easing trông dated và không phù hợp với platform thương mại
  },

  // Presets kết hợp duration + easing
  preset: {
    hover:     'all 100ms cubic-bezier(0.16, 1, 0.3, 1)',
    button:    'all 100ms cubic-bezier(0.16, 1, 0.3, 1)',
    panel:     'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
    modal:     'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
    marquee:   'transform 30s linear infinite',
  },

  // Note: Luôn thêm @media (prefers-reduced-motion: reduce) trong CSS
  // để disable animations cho người dùng nhạy cảm
} as const;


// ─── COMPONENT TOKENS ──────────────────────────────────────────────────────
// Semantic layer — map primitives → component roles
// Platform-ready: có đủ cho landing page, coach listing, CMS, CRM

export const component = {

  // Button
  button: {
    heightSm:   '36px',
    heightMd:   '44px',   // Tăng từ 46px → 44px (multiple of 4)
    heightLg:   '52px',
    paddingX:   '16px',
    paddingXSm: '12px',
    radius:     radius.sm,   // 8px
    fontWeight: font.weight.semibold,
    fontSize:   font.size.sm,
    transition: animation.preset.button,
    // Primary
    primaryBg:       color.brand.gradient,
    primaryColor:    '#FFFFFF',
    primaryHoverShadow: shadow.brandMd,
    // Secondary
    secondaryBg:     '#FFFFFF',
    secondaryBorder: color.neutral.border,
    secondaryColor:  color.role.textPrimary,
    // Ghost
    ghostBg:     'transparent',
    ghostColor:  color.brand.default,
    ghostBorder: color.brand.default,
    // Disabled
    disabledOpacity: '0.45',
  },

  // Card
  card: {
    radius:    radius.component.card,    // 16px — platform default
    radiusLg:  radius.component.cardLg, // 24px — featured
    border:    `1px solid ${color.neutral.border}`,
    bg:        color.role.bgCard,
    shadow:    shadow.sm,
    shadowHover: shadow.md,
    padding:   space.semantic.cardPad,
    paddingSm: space.semantic.cardPadSm,
    transition: animation.preset.hover,
  },

  // Category card (sport/coach carousel)
  catCard: {
    radius:      '20px',
    aspectRatio: '270/372',
    overlayBg:   'linear-gradient(to top, rgba(6,4,35,0.75) 0%, transparent 55%)',
    chipBg:      color.dark.glass,
    chipBorder:  color.dark.glassBorder,
    chipBlur:    'blur(8px)',
  },

  // Input / Form
  input: {
    height:      '44px',   // Match button height
    heightSm:    '36px',
    radius:      radius.sm,
    border:      `1px solid ${color.neutral.border}`,
    borderFocus: `1px solid ${color.brand.default}`,
    bg:          color.role.bgCard,
    bgDisabled:  color.neutral.surface,
    focusRing:   shadow.focusRing,
    fontSize:    font.size.body,
    paddingX:    '12px',
    transition:  'border-color 150ms, box-shadow 150ms',
  },

  // Header
  header: {
    height:     layout.headerH,
    bg:         'rgba(250, 251, 255, 0.92)',
    bgBlur:     'blur(12px)',
    border:     `1px solid ${color.neutral.divider}`,
    shadow:     shadow.xs,
    zIndex:     zIndex.header,
  },

  // Tag / Badge
  tag: {
    radius:     radius.xs,   // 4px
    padding:    '3px 8px',
    fontSize:   font.size.xs,
    fontWeight: font.weight.medium,
    lineHeight: '1.4',
  },

  // Pill
  pill: {
    radius:     radius.full,
    bg:         color.neutral.surface,
    border:     `1px solid ${color.neutral.border}`,
    padding:    '6px 14px',
    fontSize:   font.size.sm,
  },

  // Modal
  modal: {
    radius:     '20px',
    bg:         color.role.bgCard,
    shadow:     shadow.xl,
    overlay:    color.dark.overlay,
    zIndex:     zIndex.modal,
  },

  // Stats section (dark card)
  stats: {
    bg:         color.brand.deep,
    radius:     radius.lg,
    numSize:    font.size.h1,
    numWeight:  font.weight.extrabold,
    descSize:   font.size.xs,
  },

  // Sidebar (CMS / CRM)
  sidebar: {
    width:      layout.sidebarW,
    widthNarrow: layout.sidebarWNarrow,
    bg:         color.role.bgSubtle,
    border:     `1px solid ${color.neutral.divider}`,
    zIndex:     zIndex.sidebar,
    itemRadius: radius.sm,
    itemPadding:'8px 12px',
    itemFontSize: font.size.sm,
  },

} as const;


// ─── EXPORT ALL ────────────────────────────────────────────────────────────

const tokens = {
  color, font, space, radius, shadow,
  layout, breakpoint, zIndex, animation, component,
};

export default tokens;
