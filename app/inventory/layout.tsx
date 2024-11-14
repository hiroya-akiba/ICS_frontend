"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    AppBar,
    Box,
    Button,
    createTheme,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ThemeProvider,
    Toolbar,
    Typography,
} from "@mui/material";

import { Logout as LogoutIcon, Menu as MenuIcon } from "@mui/icons-material";
import React from "react";

declare module "@mui/material/styles"{
    interface BreakpointOverrides {
        xs: false;
        sm: false;
        md: false;
        lg: false;
        xl: false;
        mobile: true;
        desktop: true;
    }
}

const defaultTheme = createTheme({
    breakpoints: {
        values: {
            mobile: 0,
            desktop: 600,
        },
    },
});

export default function InventoryLayout({children}:{children: React.ReactNode;}){
    /** サイドバーの開閉を管理 */
    const [open, setOpen] = useState(false);
    const toggleDrawer = (open:boolean) => { setOpen(open); };

    /** 各種画面への遷移を管理 */
    const router = useRouter();
    const handleLogout = () => { router.replace("/login"); }; //ログアウト処理

    /** 開閉対象になるサイドバー本体 */
    const list = () => (
        <Box sx={{ width: 240 }}>
            <Toolbar/>
            <Divider/>
            <List>
                <ListItem component="a" href="/inventory/products" disablePadding>
                    <ListItemButton>
                        <ListItemText primary="商品一覧"/>
                    </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem component="a" href="/inventory/import_sales" disablePadding>
                    <ListItemButton>
                        <ListItemText primary="売上一括登録"/>
                    </ListItemButton>
                </ListItem>
                <Divider />
            </List>
        </Box>
    );


    return(
        <ThemeProvider theme={defaultTheme}> {/**ThemeProvider : PCとスマホで最適な画面表示をするためのレイアウト変更機能 */}
        <Box sx={{ display: "flex" }}>
        {/*################*/}
        {/*---- header ----*/}
        {/*################*/}
            <AppBar position="fixed" sx={{background: "#A6B5A5"}}>
                <Toolbar>
                    <IconButton onClick={() => toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1}}>在庫管理システム</Typography>
                    <Button onClick={() => handleLogout()} variant="contained" startIcon={<LogoutIcon />} sx={{ background: "#888888"}}>ログアウト</Button>
                </Toolbar>
            </AppBar>

        {/*###############*/}
        {/*---- aside ----*/}
        {/*###############*/}
            <Drawer open={open} onClose={() => toggleDrawer(false)} anchor="left">
                {list()}
            </Drawer>
            
        {/*##############*/}
        {/*---- list ----*/}
        {/*##############*/}
            <Box component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    marginTop: "64px",
                    width: "100%",
                    background: "#F4EBDA",
                }}
            >
                {children}
            </Box>

        {/*################*/}
        {/*---- footer ----*/}
        {/*################*/}
            <Box
                component='footer'
                sx={{
                    width: '100%',
                    position: 'fixed',
                    textAlign: 'center',
                    bottom: 0,
                    background: "#A6B5A5",
                }}
            >
                <Typography variant="caption" color="white">
                    @ 2024 akiba hiroya
                </Typography>
            </Box>
        </Box>

        </ThemeProvider>
    )
}

{/*import React from "react";
import styles from "./products/style.module.css"

// {children}に同ディレクトリ配下のpage.tsxが埋め込まれるようになっている。
// フォルダがネストされている場合でも、最も近い階層のlayout.tsxの子コンポーネントとして埋め込まれる。

export default function InventoryLayout({
    children,
}:{
    children: React.ReactNode;　//childrenの型をReact.ReactNode型で定義している。
    // React.ReactNode型は文字列、数値、React要素、それらの配列、null等、Reactでレンダリング可能なあらゆる型を受け取るための型
}) {
    return( 
        <div className={styles.layout}>
            <header className={styles.header}>ヘッダー</header>
            <div className={styles.container}>
                <aside className={styles.navbar}>サイドバー</aside>
                <main className={styles.content}>
                    <section>{children}</section>
                </main>
            </div>
            <footer className={styles.footer}>フッター</footer>
        </div>
    )
}*/}

