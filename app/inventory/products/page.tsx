'use client'

import React, { useState, useEffect } from 'react';
import productsData from "./sample/dummy_products.json";
import Link from "next/link";

type ProductData = {
    id: number;
    name: string;
    price: number;
    description: string;
}

export default function Page(){
    const [data, setData] = useState<Array<ProductData>>([]);

    useEffect(() => {
        setData(productsData); //importしたjsonを定義したステートフル変数に入れる
    }, [])

    // 新規登録処理、新規登録行の表示状態を保持
    const [shownNewRow, setShownNewRow] = useState(false);
    const handleShowNewRow = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setShownNewRow(true)
    };
    const handleAddCancel = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setShownNewRow(false)
    };
    const handleAdd = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setShownNewRow(false)
    };

    return(
        <>
            <h2>商品一覧</h2>
            <p>商品の一覧を表示します</p>
            <button onClick={ handleShowNewRow }>商品を追加する</button>
            <table>
                <tbody>
                    {shownNewRow ? (
                        <tr>
                            <td></td>
                            <td><input type="text" /></td>
                            <td><input type="number" /></td>
                            <td><input type="text" /></td>
                            <td></td>
                        </tr>
                    ): ""}

                    {/*setDataで代入したステートフル変数をforEachで回す*/}
                    {data.map((data:any) => (
                        <tr key={data.id}>
                            <td>{data.id}</td>
                            <td>{data.name}</td>
                            <td>{data.price}</td>
                            <td>{data.description}</td>
                            <td><Link href={`/inventory/products/${data.id}`}>在庫処理</Link></td>
                            <td>
                                <button>更新・削除</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}