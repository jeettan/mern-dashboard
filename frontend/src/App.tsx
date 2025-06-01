import {
  AuthBindings,
  Authenticated,
  GitHubBanner,
  Refine,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  RefineSnackbarProvider,
  useNotificationProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import dataProvider from "@refinedev/simple-rest";
import axios from "axios";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { CredentialResponse } from "./interfaces/google";

import { Login } from "./pages/login";
import { parseJwt } from "./utils/parse-jwt";

import Title from "./components/header/title";
import { ThemedLayoutV2 } from "./components/layout";

import AppsIcon from "@mui/icons-material/Apps";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import StarRateIcon from "@mui/icons-material/StarRate";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";

import {
  Agent,
  AgentProfile,
  AllProperties,
  CreateProperties,
  EditProperties,
  Home,
  PropertyDetail,
  Review,
  Message,
} from "./pages";
import { StarRate } from "@mui/icons-material";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

function App() {
  const authProvider: AuthBindings = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;

      if (profileObj) {
        const response = await fetch("http://localhost:8000/api/v1/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profileObj.name,
            email: profileObj.email,
            avatar: profileObj.picture,
          }),
        });

        const data = await response.json();

        if (response.status === 200) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...profileObj,
              avatar: profileObj.picture,
            })
          );
        }

        localStorage.setItem("token", `${credential}`);

        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
      };
    },
    logout: async () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return {};
        });
      }

      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      console.error(error);
      return { error };
    },
    check: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Token not found",
        },
        logout: true,
        redirectTo: "/login",
      };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return JSON.parse(user);
      }

      return null;
    },
  };

  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider("http://localhost:8000/api/v1")}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                resources={[
                  {
                    name: "Dashboard",
                    icon: <AppsIcon />,
                    list: "/home",
                    //                  create: "/blog-posts/create",
                    //                  edit: "/blog-posts/edit/:id",
                    //                  show: "/blog-posts/show/:id",
                  },
                  {
                    name: "properties",
                    icon: <HomeIcon />,
                    list: "/properties",
                    create: "/properties/create",
                    show: "properties/show/:id",
                    //                  create: "/blog-posts/create",
                    //                  edit: "/blog-posts/edit/:id",
                    //                  show: "/blog-posts/show/:id",
                  },
                  {
                    name: "Agents",
                    icon: <PeopleAltIcon />,
                    list: "/agents",
                    //                  create: "/blog-posts/create",
                    //                  edit: "/blog-posts/edit/:id",
                    //                  show: "/blog-posts/show/:id",
                  },
                  {
                    name: "Reviews",
                    icon: <StarRateIcon />,
                    list: "/reviews",
                    //                  create: "/blog-posts/create",
                    //                  edit: "/blog-posts/edit/:id",
                    //                  show: "/blog-posts/show/:id",
                  },
                  {
                    name: "Messages",
                    icon: <MessageIcon />,
                    list: "/messages",
                    //                  create: "/blog-posts/create",
                    //                  edit: "/blog-posts/edit/:id",
                    //                  show: "/blog-posts/show/:id",
                  },
                  {
                    name: "MyProfile",
                    icon: <PersonIcon />,
                    list: "/profile",
                    //                  create: "/blog-posts/create",
                    //                  edit: "/blog-posts/edit/:id",
                    //                  show: "/blog-posts/show/:id",
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "2jXMSx-7aPqdu-n7gq30",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={() => <Header sticky />}
                          Title={({ collapsed }) => (
                            <Title collapsed={collapsed} />
                          )}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="home" />}
                    />
                    <Route path="/home">
                      <Route index element={<Home />} />
                    </Route>
                    <Route path="/Properties">
                      <Route index element={<AllProperties />} />
                      <Route path="create" element={<CreateProperties />} />
                      <Route path="show/:id" element={<PropertyDetail />} />
                      <Route path="edit/:id" element={<EditProperties />} />
                    </Route>
                    <Route path="/Agents">
                      <Route index element={<AgentProfile />} />
                    </Route>
                    <Route path="/Reviews">
                      <Route index element={<Review />} />
                    </Route>
                    <Route path="/Messages">
                      <Route index element={<Message />} />
                    </Route>
                    <Route path="/profile">
                      <Route index element={<AgentProfile />} />
                    </Route>
                  </Route>

                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
