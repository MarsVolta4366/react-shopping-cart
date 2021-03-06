import { useState } from "react"
import { useQuery } from "react-query"
// Components
import Cart from "./Cart/Cart"
import { Badge, Drawer, Grid, LinearProgress } from "@material-ui/core"
import { AddShoppingCart } from "@material-ui/icons"
import Item from "./Item/Item"
// Styles
import { StyledButton, Wrapper } from "./App.styles"

// At 44:36min https://www.youtube.com/watch?v=sfmL6bGbiN8

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

  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([] as CartItemType[])
  const { data, isLoading, error } = useQuery<CartItemType[]>("products", getProducts)
  console.log(data)

  const getTotalItems = (items: CartItemType[]) => (
    items.reduce((total: number, item) => total + item.amount, 0)
  )

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      // Is the item already in the cart
      const isItemInCart = prev.find(item => item.id === clickedItem.id)
      if (isItemInCart) {
        return prev.map(item => (
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        ))
      }
      // First time the item is added
      return [...prev, { ...clickedItem, amount: 1 }]
    })
  }

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => (
      prev.reduce((total, item) => {
        if (item.id === id) {
          if (item.amount === 1) {
            return total
          } else {
            return [...total, { ...item, amount: item.amount - 1 }]
          }
        } else {
          return [...total, item]
        }
      }, [] as CartItemType[])
    ))
  }

  if (isLoading) {
    return <LinearProgress />
  }
  if (error) {
    return <div>Something went wrong...</div>
  }

  return (
    <Wrapper>
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      >
        <Cart cartItems={cartItems} addToCart={handleAddToCart} removeFromCart={handleRemoveFromCart} />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCart />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  )
}

export default App
