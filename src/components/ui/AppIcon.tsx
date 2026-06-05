'use client';

import type { ComponentType, CSSProperties } from 'react';
import {
  Calendar, Calendar1, CalendarTick, Flash, Location, Profile2User, User, UserTick,
  Clock, Wallet, Coin, Teacher, Flag, Routing, ShieldTick, Cup, Chart, Cpu, Global,
  SearchNormal1, Bank, Card, MessageText, Note1, Camera, Lock, RefreshCircle, TickCircle,
  CloseCircle, Warning2, InfoCircle, Eye, Send2, Book, Briefcase, Star1, ClipboardText,
  Setting2, Sms, Lamp, Activity, Magicpen, MedalStar, ArrowRight2, Personalcard, People,
} from 'iconsax-reactjs';

/**
 * AppIcon — wrapper duy nhất cho icon hệ thống (convention: KHÔNG dùng emoji).
 * Dùng bộ iconsax-reactjs. Mặc định `color="currentColor"` để icon thừa hưởng
 * màu chữ của ngữ cảnh, căn dòng sẵn cho inline text.
 *
 * Quy tắc dùng: chỉ thêm icon khi nó làm rõ nghĩa (metadata, trạng thái, hành động).
 * KHÔNG rải icon vào mọi dòng chữ.
 */

export type AppIconVariant = 'Linear' | 'Outline' | 'Bold' | 'Bulk' | 'Broken' | 'TwoTone';

type SaxProps = {
  size?: number | string;
  color?: string;
  variant?: AppIconVariant;
  className?: string;
  style?: CSSProperties;
};

// Semantic name → iconsax component
const MAP = {
  calendar: Calendar,
  calendarSingle: Calendar1,
  calendarTick: CalendarTick,
  flash: Flash,
  location: Location,
  people: Profile2User,
  peopleAlt: People,
  user: User,
  userTick: UserTick,
  clock: Clock,
  wallet: Wallet,
  coin: Coin,
  teacher: Teacher,
  flag: Flag,
  target: Routing,
  shield: ShieldTick,
  cup: Cup,
  chart: Chart,
  cpu: Cpu,
  global: Global,
  search: SearchNormal1,
  bank: Bank,
  card: Card,
  message: MessageText,
  note: Note1,
  camera: Camera,
  lock: Lock,
  refresh: RefreshCircle,
  check: TickCircle,
  close: CloseCircle,
  warning: Warning2,
  info: InfoCircle,
  eye: Eye,
  send: Send2,
  book: Book,
  briefcase: Briefcase,
  star: Star1,
  clipboard: ClipboardText,
  setting: Setting2,
  mail: Sms,
  lamp: Lamp,
  activity: Activity,
  magic: Magicpen,
  medal: MedalStar,
  next: ArrowRight2,
  idcard: Personalcard,
} satisfies Record<string, ComponentType<SaxProps>>;

export type AppIconName = keyof typeof MAP;

type AppIconProps = {
  name: AppIconName;
  size?: number | string;
  variant?: AppIconVariant;
  /** Mặc định currentColor — chỉ override khi cần màu riêng (token). */
  color?: string;
  className?: string;
  style?: CSSProperties;
};

export default function AppIcon({
  name,
  size = 16,
  variant = 'Linear',
  color = 'currentColor',
  className,
  style,
}: AppIconProps) {
  const Cmp = MAP[name];
  if (!Cmp) return null;
  return (
    <Cmp
      size={size}
      color={color}
      variant={variant}
      className={className}
      style={{ verticalAlign: '-0.15em', flexShrink: 0, ...style }}
    />
  );
}
