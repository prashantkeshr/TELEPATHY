import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/layouts/AppShell";
import { SeoManager } from "@/seo/SeoManager";
import { AboutPage } from "@/features/about/AboutPage";
import { OnboardingPage } from "@/features/profile/onboarding/OnboardingPage";
import { HomePage } from "@/features/home/HomePage";
import { DiscoverPage } from "@/features/discovery/DiscoverPage";
import { RandomMatchPage } from "@/features/discovery/RandomMatchPage";
import { ChatsPage } from "@/features/chat/ChatsPage";
import { ConversationView } from "@/features/chat/ConversationView";
import { ChatPreviewPage } from "@/features/chat/ChatPreviewPage";
import { RoomsPage } from "@/features/rooms/RoomsPage";
import { HostRoomPage } from "@/features/rooms/HostRoomPage";
import { JoinRoomPage } from "@/features/rooms/JoinRoomPage";
import { FriendsPage } from "@/features/friends/FriendsPage";
import { IdeasPage } from "@/features/ideas/IdeasPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { NotFoundPage } from "@/features/not-found/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <SeoManager />,
    children: [
  { path: "/onboarding", element: <OnboardingPage /> },
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "discover", element: <DiscoverPage /> },
      { path: "discover/random", element: <RandomMatchPage /> },
      { path: "chats", element: <ChatsPage /> },
      { path: "chats/preview", element: <ChatPreviewPage /> },
      { path: "chats/:id", element: <ConversationView /> },
      { path: "rooms", element: <RoomsPage /> },
      { path: "rooms/host", element: <HostRoomPage /> },
      { path: "rooms/join", element: <JoinRoomPage /> },
      { path: "friends", element: <FriendsPage /> },
      { path: "ideas", element: <IdeasPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
    ],
  },
]);
