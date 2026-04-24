import {createRootRoute} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { RootShell } from "./RootShell";
import NotFoundComponent from "../components/shared/NotFound";
import RootComponent from "./RootComponent";


export const Route = createRootRoute({
 
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});


