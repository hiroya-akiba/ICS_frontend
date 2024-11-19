import { createTheme, ThemeProvider } from "@mui/material";
import * as React from "react"

export const theme = createTheme({
    palette: {
        primary: {
        },
    },
});
{/**accent: "#A6B5A5",
            text: "#262724",
            base: "#F4EBDA",
 */}

export function Example({ children }: { children: React.ReactNode }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
  }