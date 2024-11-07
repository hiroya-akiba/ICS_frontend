'use client'

import {useForm} from "react-hook-form";
import React, { useState, useEffect } from 'react';
import productsData from "./sample/dummy_products.json";
import Link from "next/link";

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

    // useEffect関数を定義
    useEffect(() => {
        setData(productsData); //importしたjsonを定義したステートフル変数に入れる
    }, [])

    // ステートフル変数を定義
    const[id, setId] = useState<number | null>(0); //number型 or null型をidに設定可能, 初期値は0
    const[action, setAction] = useState<string>("");

    /**
     * onSubmit関数
     * actionの値によってPOSTされたフォームに対する動作を切り替える
     * add: handleAdd(新たなデータを生成)
     * update: handleEdit(既存データを編集)
     * delete: handleDelete(既存データを削除)
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
            handleEdit(data)
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
        setId(0);
    }

    const handleDelete = (id: number) => {
        setId(0);
    }

    return(
        <>
            <h2>商品一覧</h2>
            <p>商品の一覧を表示します</p>
            <button onClick={ handleShowNewRow }>商品を追加する</button>
            <form onSubmit={handleSubmit(onSubmit)}>
                <table>
                    <thead>
                        <tr>
                            <th>商品ID</th>
                            <th>商品名</th>
                            <th>単価</th>
                            <th>説明</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/*アイテムが一つもない時には、登録フォームだけを表示する。*/}
                        {id === null ?(
                            <tr>
                                <td></td>
                                <td>
                                {/* register */}
                                    <input type="text" id="name" {...register("name", {required: true, maxLength: 100})} />
                                    {errors.name && (<div>100文字以内の商品名を入力してください</div>)}
                                </td>
                                <td>
                                    <input type="number" id="price" {...register("price", {required: true, min: 1, max: 99999999, })}/>
                                    {errors.price && (<div>1から99999999の数値を入力してください</div>)}
                                </td>
                                <td>
                                    <input type="text" id="description" {...register("description")} />
                                </td>
                                {/*ルーティングのために追加*/}
                                <td></td>
                                <td>
                                    <button type="button" onClick={() => handleAddCancel()}>キャンセル</button> {/*関数をonClickに追加する*/}
                                    <button type="submit" onClick={() => setAction("add")}>登録する</button>
                                </td>
                            </tr>
                        ) : ("")}
                        {/*アイテムが一つ以上存在するとき*/}
                        {/*handleEditRow関数を呼び出して、ステートフル変数idに値を入れることで、編集モードに切り替える。*/}
                        {data.map((data: any) => (
                            id === data.id ? (
                                <tr key={data.id}>
                                    <td>{data.id}</td>
                                    <td>
                                        <input type="text" id="name" {...register("name", {required: true, maxLength: 100})} />
                                        {errors.name && (<div>100文字以内の商品名を入力してください</div>)}
                                    </td>
                                    <td>
                                        <input type="number" id="price" {...register("price", {required: true, min: 1, max: 99999999, })}/>
                                        {errors.price && (<div>1から99999999の数値を入力してください</div>)}
                                    </td>
                                    <td>
                                        <input type="text" id="description" {...register("description")} />
                                    </td>
                                    <td></td>
                                    <td>
                                        <button type="button" onClick={() => handleEditCancel()}>キャンセル</button>
                                        <button type="submit" onClick={() => setAction("update")}>更新する</button>
                                        <button type="submit" onClick={() => setAction("delete")}>削除する</button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={data.id}>

                                    <td>{data.id}</td>
                                    <td>{data.name}</td>
                                    <td>{data.price}</td>
                                    <td>{data.description}</td>
                                    <td><Link href={`/inventory/products/${data.id}`}>在庫処理</Link></td>
                                    <td>
                                        <button onClick={() => handleEditRow(data.id)}>更新・削除</button>
                                    </td>
                                </tr>
                            )
                        ))}
                    {/*商品追加欄*/}
                    {/*shownNewRowの値がtrueの時: 追加欄を表示する*/}
                    {/*
                        {shownNewRow ? (
                            <tr>
                                <td></td>
                                <td><input type="text" name="name" onChange={handleInput}/></td>
                                <td><input type="number" name="price" onChange={handleInput}/></td>
                                <td><input type="text" name="description" onChange={handleInput}/></td>
                                <td></td>
                                <td>
                                    <button onClick={(event) => handleAddCancel(event)}>キャンセル</button>
                                    <button onClick={(event) => handleAdd(event)}>登録する</button>
                                </td>
                            </tr>
                        ): ""}
                    */}
                    {/*edittingRowの値が商品IDと同一の時 : 更新モード
                       edittingRowの値が0の時           : 表示モード*/}
                        {/*setDataで代入したステートフル変数をforEachで回す*/}
                        {/*
                        {data.map((data: any) => (
                            editingRow === data.id ? (
                                <tr key={data.id}>
                                    <td>{data.id}</td>
                                    <td><input type="text"   defaultValue={input.name} /></td>
                                    <td><input type="number" defaultValue={input.price} /></td>
                                    <td><input type="text"   defaultValue={input.description} /></td>
                                    <td></td>
                                    <td>
                                        <button onClick={() => handleEditCancel(data.id)}>キャンセル</button>
                                        <button onClick={() => handleEdit(data.id)}>更新する</button>
                                        <button onClick={() => handleDelete(data.id)}>削除する</button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={data.id}>

                                    <td>{data.id}</td>
                                    <td>{data.name}</td>
                                    <td>{data.price}</td>
                                    <td>{data.description}</td>
                                    <td><Link href={`/inventory/products/${data.id}`}>在庫処理</Link></td>
                                    <td>
                                        <button onClick={() => handleEditRow(data.id)}>更新・削除</button>
                                    </td>
                                </tr>
                            )
                        ))}
                        */}
                    </tbody>
                </table>
            </form>
        </>
    )
}