import {
  ArrowDown01,
  ArrowDownAZ,
  ArrowUp01,
  ArrowUpAZ,
  ArrowUpDown,
  BookOpenText,
  CalendarClock,
  CalendarPlus,
  Check,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleCheck,
  CircleDashed,
  CirclePlus,
  CircleSlash,
  CircleX,
  ClipboardCopy,
  Clock,
  Component,
  EyeOff,
  FilePlus2,
  Frown,
  LayoutDashboard,
  Loader,
  LucideIcon,
  MoreHorizontal,
  MoveDown,
  MoveUp,
  PackageOpen,
  Plus,
  Settings2,
  TextSelect,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  logo: Component,
  loader: Loader,
  add: Plus,
  addCircle: CirclePlus,
  leftArrow: ChevronLeft,
  actions: MoreHorizontal,

  statusWaiting: CircleDashed,
  statusRejected: CircleX,
  statusOpen: Circle,
  statusCancelled: CircleSlash,
  statusComplete: CircleCheck,

  actionView: BookOpenText,
  actionAccept: Check,
  actionReject: X,
  actionDelete: Trash2,
  actionClipboardCopy: ClipboardCopy,
  actionClear: X,

  hide: EyeOff,
  sort: ArrowUpDown,
  sortAscDef: MoveDown,
  sortDescDef: MoveUp,
  sortAscText: ArrowDownAZ,
  sortDescText: ArrowUpAZ,
  sortAscNumber: ArrowDown01,
  sortDescNumber: ArrowUp01,
  actionBill: FilePlus2,
  arrowLeft: ChevronLeft,
  arrowRight: ChevronRight,
  arrowFirst: ChevronFirst,
  arrowLast: ChevronLast,
  settings: Settings2,

  navDashboard: LayoutDashboard,
  navPayables: TextSelect,

  calendarAdd: CalendarPlus,
  calendarClock: CalendarClock,
  timestamp: Clock,

  user: UserRound,

  illustration: {
    searchEmptyResult: Frown,
    noData: PackageOpen,
  },
};
