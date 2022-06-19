import { Badge, Drawer, Grid, LinearProgress } from "@material-ui/core"
import { AddShoppingCart } from "@material-ui/icons"
import { useState } from "react"
import { useQuery } from "react-query"
import { Wrapper } from "./App.styles"

// At 13:36min https://www.youtube.com/watch?v=sfmL6bGbiN8

// Types
export type CartItemType = {
  id: number,
  category: string,
  description: string,
  image: string,
  price: number,
  title: string
  amount: number
}

const getProducts = async (): Promise<CartItemType[]> => {
  return await (await fetch("https://fakestoreapi.com/products")).json()
}

const App = () => {

  const { data, isLoading, error } = useQuery<CartItemType[]>("products", getProducts)
  console.log(data)

  return (
    <div className="App">
      Start
    </div>
  )
}

export default App
