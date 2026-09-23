import { Home, Compass, MessageSquare, DoorOpen, Users, Lightbulb, Settings } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  end?: boolean;
}

export const primaryNavItems: NavItem[] = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/chats", label: "Chats", icon: MessageSquare },
  { to: "/rooms", label: "Rooms", icon: DoorOpen },
  { to: "/friends", label: "Friends", icon: Users },
  { to: "/ideas", label: "Ideas", icon: Lightbulb },
];

export const bottomNavItems: NavItem[] = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/chats", label: "Chats", icon: MessageSquare },
  { to: "/rooms", label: "Rooms", icon: DoorOpen },
];

export const settingsNavItem: NavItem = { to: "/settings", label: "Settings", icon: Settings };
