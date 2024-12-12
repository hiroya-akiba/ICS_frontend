'use client'

import {
    createTheme,
    Box,
    Button,
    Container,
    CssBaseline,
    TextField,
    ThemeProvider,
    Typography,
} from "@mui/material"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "../../plugins/axios";

type FormData = {
    username: string;
    password: string;
};

export default function Page(){
    const{
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    /**
     * userRouter
     * Next.jsで提供されるhook. 生成されたオブジェクトを関数内で以下のように呼び出すことで、
     * return本文外の、関数内で遷移の制御を行うことができることが特徴
     * このオブジェクトはリファラーURL等の様々な情報を有しているため、戻る・リロードといった
     * 機能の実装にも使用できる。
     */
    const router = useRouter();

    const [authError, setAuthError] = useState("");

    const defaultTheme = createTheme();

    const onSubmit = (event: any): void =>{
        const data: FormData = {
            username: event.username,
            password: event.password,
        };
        handleLogin(data);
    }

    const handleLogin = (data: FormData) => {
        axios
            .post("api/inventory/login", data)
            .then((response) => {
                router.push("/inventory/products");
            })
            .catch(function (error) {
                setAuthError("ユーザー名またはパスワードに誤りがあります。");
            });
    };

    return(
        <ThemeProvider theme={defaultTheme}>
            <Container component="main">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                <Typography component="h1" variant="h5">
                    ログイン
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    {authError && (
                        <Typography variant="body2" color="error">
                            {authError}
                        </Typography>
                    )}{" "}
                    <TextField
                        type="text"
                        id="username"
                        variant="filled"
                        label="ユーザー名(必須)"
                        fullWidth
                        margin="normal"
                        {...register("username", { required: "必須入力です。" })}
                        error={Boolean(errors.username)}
                        helperText={errors.username?.message?.toString() || ""}
                    />
                    <TextField
                        type="password"
                        id="password"
                        variant="filled"
                        label="パスワード(必須)"
                        autoComplete="current-password"
                        fullWidth
                        margin="normal"
                        {...register("password", {
                            required: "必須入力です。",
                            minLength: {
                                value: 8,
                                message: "8文字以上の文字列にしてください。",
                            },
                        })}
                        error={Boolean(errors.password)}
                        helperText={errors.password?.message?.toString() || ""}
                    />
                    {/** 
                     * ?の意味
                     * ?.はオプショナルチェイニングというJSの構文で、存在有無を確認するためのif文
                     * errors.password?.messageでerrors.passwordの存在有無チェックして、
                     * あればその中のmessageを取得し、無ければundefinedを返す。
                     * また、errors.password?.message?.toString()では、messageが存在するか確認したうえで、
                     * toString()メソッドを呼び出す。
                     * messageがundefinedやnullなら、エラーを投げずにundefinedを返す。
                     * messageが存在すれば、toString()を呼び出す。
                     * */}
                    {/**
                     * ||の意味
                     * ||は左側の値がFalsy (null, undefined, false, 0, "")の場合に右の値を返すもの
                     */}
                    {/**
                     * 全体の意味
                     * errors(フォームの状態を保持するオブジェクトで、errorsプロパティはバリデーションエラーの情報を保持する。)
                     * の中にerror.passwordが存在していれば、
                     * その中のmessageをtoString()変換して表示する。
                     */}
                     <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        sx={{ mt: 3, mb: 2, background: "#A6B5A5"}}
                     >
                        ログイン
                     </Button>
                </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}