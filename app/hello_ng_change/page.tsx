'use client'

import {useState} from 'react'

export default function Page(){
    //let data = { name: '初期値'}
    const [data, setData] = useState({ name: '初期値'})
    const change = {name: '変更'}
    setData(change)

    return <div>hello {data.name}!</div>
}