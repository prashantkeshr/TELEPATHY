import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/layouts/AppShell";
import { OnboardingPage } from "@/features/profile/onboarding/OnboardingPage";
import { HomePage } from "@/features/home/HomePage";
import { DiscoverPage } from "@/features/discovery/DiscoverPage";
import { RandomMatchPage } from "@/features/discovery/RandomMatchPage";
import { ChatsPage } from "@/features/chat/ChatsPage";
import { RoomsPage } from "@/features/rooms/RoomsPage";
import { FriendsPage } from "@/features/friends/FriendsPage";
import { IdeasPage } from "@/features/ideas/IdeasPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { NotFoundPage } from "@/features/not-found/NotFoundPage";

export const router = createBrowserRouter([
  { path: "/onboarding", element: <OnboardingPage /> },
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "discover", element: <DiscoverPage /> },
      { path: "discover/random", element: <RandomMatchPage /> },
      { path: "chats", element: <ChatsPage /> },
      { path: "rooms", element: <RoomsPage /> },
      { path: "friends", element: <FriendsPage /> },
      { path: "ideas", element: <IdeasPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
