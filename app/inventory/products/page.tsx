'use client'

import { useState, useEffect } from 'react';
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
        setData(productsData);
    }, [])

    return(
        <>
            <h2>商品一覧</h2>
            <p>商品の一覧を表示します</p>
            <table>
                <tbody>
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