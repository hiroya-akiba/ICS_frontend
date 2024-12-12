'use client'

import {
    Alert,
    AlertColor,
    Box,
    Button,
    IconButton,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import {
    Add as AddIcon,
    Cancel as CancelIcon,
    Check as CheckIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from "@mui/icons-material";

import {useForm} from "react-hook-form";
import React, { useState, useEffect } from 'react';
import productsData from "./sample/dummy_products.json";
import Link from "next/link";
import axios from "../../../plugins/axios";

/**
 * 製品データ
 * 製品の属性を定義する
 */
type ProductData = {
    id: number | null; //初期値を入れる
    name: string;
    price: number;
    description: string;
}

/**
 * デフォルト関数
 */
export default function Page(){
    /**
     * useForm関数
     * 以下はreact-hook-formライブラリのフォーム管理のための構文
     * useForm()という関数を呼び出して、いくつかの関数に分割して取得している。
     * フォーム作成、送信処理、エラーハンドリングなどの操作の管理をするためのプロパティが用意されている。
     * この関数を用いることでフォーム管理が簡単に行えるようになる。
     */
    const {
        register,            // フォームの各フィールドを登録するための関数
        handleSubmit,        // フォームの送信イベントを処理する関数
        reset,               // フォームの値を初期状態にリセットするための関数
        formState: {errors}, // フォームの状態を保持するオブジェクトで、errorsプロパティはバリデーションエラーの情報を保持する。
    } = useForm();

    // ステートフル変数dataを定義, 型はArray型, Array型の中身はProductData型
    const [data, setData] = useState<Array<ProductData>>([]);

    // 読み込みデータを保持するステートフル変数を定義
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState<AlertColor>('success');
    const [message, setMessage] = useState('');
    /**
     * result関数
     * Add, Edit, Delete等のDB処理を行った際にスナックバーを表示するための関数
     * @param severity 表示する色 Success, Info, Warning, Error
     * @param message 表示するメッセージ
     */
    const result = (severity: AlertColor, message: string) => {
        setOpen(true);
        setSeverity(severity);
        setMessage(message);
    }

    const handleClose = (event: any, reason: any) => {
        setOpen(false);
    }

    // useEffect関数を定義
    useEffect(() => {
        axios.get('/api/inventory/products/') // DBからデータを取得
            .then((res) => res.data) // responseからdataを取り出す
            .then((data) => {
                setData(data); //DBから取得したデータをステートフル変数に入れる
            })
        // setData(productsData); //importしたjsonを定義したステートフル変数に入れる
        }, [open])

    // ステートフル変数を定義
    const [id, setId] = useState<number | null>(0); //number型 or null型をidに設定可能, 初期値は0
    const [action, setAction] = useState<string>("");

    /**
     * onSubmit関数
     * actionの値によってPOSTされたフォームに対する動作を切り替える
     * add: handleAdd(新たなデータを生成し、スナックバーを表示させる)
     * update: handleEdit(既存データを編集し、スナックバーを表示させる)
     * delete: handleDelete(既存データを削除し、スナックバーを表示させる)
     * @param event クリックした時のevent
     */
    const onSubmit = (event: any): void =>{ // event(any型)を引数として返却値は空の関数を定義
        // ProductData型のdata変数を作成
        const data: ProductData = { //ステートフル変数として定義したdataとは関係なく、ローカルなdataを定義する。
            id: id,
            name: event.name,
            price: Number(event.price),
            description: event.description,
        };

        if (action === "add"){
            handleAdd(data);

        } else if (action === "update") {
            if (data.id === null){
                return;
            }
            handleEdit(data) //result
        } else if (action === "delete") {
            if (data.id === null) {
                return;
            }
            handleDelete(data.id);
        }
    };

    /** 
     * 新規登録処理、新規登録行の表示状態を保持する関数
     */
    const handleShowNewRow = () => {
        // ステートフル変数idにnullを代入
        setId(null);
        // reset関数を呼び出す
        reset({
            name: "",
            price: "0",
            description: "",
        });
    };

    /**
     * キャンセル時の関数
     */
    const handleAddCancel = () => {
        setId(0);
    };

    /**
     * 追加時の関数
     */
    const handleAdd = (data: ProductData) => {
        axios.post("/api/inventory/products", data)
            .then((response) => {
                result('success', '商品が登録されました')
            }
        )
        setId(0);
    };

    /**
     * 更新・削除処理、更新・削除行の表示状態を保持する関数
     */
    const handleEditRow = (id: number | null) => {

        /** 
         * selectedProductという定数をProductData型で定義
         *   findメソッド: カッコ内を満たす最初のdata要素を返却し、見つからなかった場合はundefinedを返却
         *   v: data配列内の各オブジェクトを指す
         *   as ProductData: 戻り値をキャスト(強制型変換)する (undefinedを返した場合のエラーハンドリング)
         */
        const selectedProduct: ProductData = data.find( (v) => v.id === id ) as ProductData;

        // ステートフル変数idに代入
        setId(selectedProduct.id);

        // reset関数を呼び出す
        // 初期値に元の名前・値段・説明を入れて表示させる。
        reset({
            name: selectedProduct.name,
            price: selectedProduct.price,
            description: selectedProduct.description,
        });
    };

    const handleEditCancel = () => {
        setId(0);
    }

    const handleEdit = (data: ProductData) => {
        axios.put(`/api/inventory/products/${data.id}`, data)
            .then((response) => {
                result('success', '商品が更新されました')                
            }
        );
        setId(0);
    }

    const handleDelete = (id: number) => {
        result('success', '商品が削除されました')
        setId(0);
    }

    return(
        <>
            {/** Snackbar ... アイテム削除時などに一時的に表示され一定時間経過後に自動で消えるコンポーネント */}
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                {/** Alert ... 警告の種類をseverityで決める。success -> info -> warning -> error など */}
                <Alert severity={severity}>{message}</Alert>
            </Snackbar>
            {/** Typography ... テーマと統合して、全体的なデザインに一貫性を持たせることができる */}
            <Typography>商品一覧</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleShowNewRow() }> 商品を追加する </Button>
            {/** 
             * Box .......... componentプロパティにhtml要素を設定して一つのコンポーネントを作る
             * Container .... Boxとほぼ同じ, maxWidthと一緒に使用して真ん中に寄せたい場合に使用する
             * Typography ... variantプロパティに設定したhtml要素のテーマが適用される, 要素はcomponentで決まる, スタイリングするために使用
             * */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ height: 400, width: "100%"}}>
                <TableContainer>
                    <Table sx={{display: { mobile: "none", desktop: "table"}}}>
                        <TableHead>
                            <TableRow>
                                <TableCell>商品ID</TableCell>
                                <TableCell>商品名</TableCell>
                                <TableCell>単価</TableCell>
                                <TableCell>説明</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/*「商品を追加する」の押下時には、登録フォームだけを表示する。*/}
                            {/** 「商品を追加する」を押下するとステートフル変数idにnullが代入される。*/}
                            {id === null ?(
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>
                                    {/* register */}
                                        <TextField 
                                                type="text"
                                                id="name" 
                                                {...register("name", {
                                                    required: "必須入力です。",
                                                    maxLength: {
                                                        value: 100,
                                                        message: "100文字以内の商品名を入力してください。",
                                                    }
                                                })}
                                                error={Boolean(errors.name)}
                                                helperText={errors.name?.message?.toString() || ""} 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            id="price"
                                            {...register("price", {
                                            required: "必須入力です。",
                                            min: {
                                                value: 1,
                                                message: "1から99999999の数値を入力してください",
                                            },
                                            max: {
                                                value: 99999999,
                                                message: "1から99999999の数値を入力してください",
                                            },
                                            })}
                                            error={Boolean(errors.price)}
                                            helperText={errors.price?.message?.toString() || ""}
                                        />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        type="text"
                                        id="description"
                                        {...register("description")}
                                    />
                                </TableCell>
                                {/* ルーティングのために追加 */}
                                <TableCell></TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={() => handleAddCancel()}
                                    >
                                        キャンセル
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<CheckIcon />}
                                        onClick={() => setAction("add")}
                                    >
                                        登録する
                                    </Button>
                                </TableCell>
                                </TableRow>
                            ) : ("")}
                            {/* 「更新・削除」ボタンを押下すると、
                            handleEditRow関数を呼び出して、ステートフル変数idにその商品ID値を入れることで、編集モードに切り替える。*/}
                            {data.map((data: any) => (
                                id === data.id ? (
                                    <TableRow key={data.id}>
                                        <TableCell>{data.id}</TableCell>
                                        <TableCell>
                                        <TextField
                                            type="text"
                                            id="name"
                                            {...register("name", {
                                                required: "必須入力です。",
                                                maxLength: {
                                                    value: 100,
                                                    message: "100文字以内の商品名を入力してください。",
                                                }
                                            })}
                                            error={Boolean(errors.name)}
                                            helperText={errors.name?.message?.toString() || ""}
                                        />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                id="price"
                                                {...register("price", {
                                                required: "必須入力です。",
                                                min: {
                                                    value: 1,
                                                    message: "1から99999999の数値を入力してください",
                                                },
                                                max: {
                                                    value: 99999999,
                                                    message: "1から99999999の数値を入力してください",
                                                },
                                                })}
                                                error={Boolean(errors.price)}
                                                helperText={errors.price?.message?.toString() || ""}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="text"
                                                id="description"
                                                {...register("description")}
                                            />
                                        </TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>
                                            <Button
                                                  variant="outlined"
                                                  startIcon={<CancelIcon />}
                                                  onClick={() => handleEditCancel()}
                                            >
                                                キャンセル
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                startIcon={<CheckIcon />}
                                                onClick={() => setAction("update")}
                                            >
                                                更新する
                                            </Button>
                                            <IconButton
                                                aria-label="削除する"
                                                type="submit"
                                                color="warning"
                                                onClick={() => setAction("delete")}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow key={data.id}>

                                        <TableCell>{data.id}</TableCell>
                                        <TableCell>{data.name}</TableCell>
                                        <TableCell>{data.price}</TableCell>
                                        <TableCell>{data.description}</TableCell>
                                        <TableCell><Link href={`/inventory/products/${data.id}`}>在庫処理</Link></TableCell>
                                        <TableCell>
                                            <IconButton
                                                aria-label="編集する"
                                                color="primary"
                                                onClick={() => handleEditRow(data.id)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            ))}
                        {/*商品追加欄*/}
                        {/*shownNewRowの値がtrueの時: 追加欄を表示する*/}
                        {/*
                            {shownNewRow ? (
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell><input type="text" name="name" onChange={handleInput}/></TableCell>
                                    <TableCell><input type="number" name="price" onChange={handleInput}/></TableCell>
                                    <TableCell><input type="text" name="description" onChange={handleInput}/></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>
                                        <button onClick={(event) => handleAddCancel(event)}>キャンセル</button>
                                        <button onClick={(event) => handleAdd(event)}>登録する</button>
                                    </TableCell>
                                </TableRow>
                            ): ""}
                        */}
                        {/*edittingRowの値が商品IDと同一の時 : 更新モード
                           edittingRowの値が0の時           : 表示モード*/}
                            {/*setDataで代入したステートフル変数をforEachで回す*/}
                            {/*
                            {data.map((data: any) => (
                                editingRow === data.id ? (
                                    <TableRow key={data.id}>
                                        <TableCell>{data.id}</TableCell>
                                        <TableCell><input type="text"   defaultValue={input.name} /></TableCell>
                                        <TableCell><input type="number" defaultValue={input.price} /></TableCell>
                                        <TableCell><input type="text"   defaultValue={input.description} /></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>
                                            <button onClick={() => handleEditCancel(data.id)}>キャンセル</button>
                                            <button onClick={() => handleEdit(data.id)}>更新する</button>
                                            <button onClick={() => handleDelete(data.id)}>削除する</button>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow key={data.id}>

                                        <TableCell>{data.id}</TableCell>
                                        <TableCell>{data.name}</TableCell>
                                        <TableCell>{data.price}</TableCell>
                                        <TableCell>{data.description}</TableCell>
                                        <TableCell><Link href={`/inventory/products/${data.id}`}>在庫処理</Link></TableCell>
                                        <TableCell>
                                            <button onClick={() => handleEditRow(data.id)}>更新・削除</button>
                                        </TableCell>
                                    </TableRow>
                                )
                            ))}
                            */}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}