import React, { useState, useEffect } from 'react'
import { commerce } from './lib/commerce'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// components
import { Navigation, Products, Cart, Checkout } from './components/'

const App = () => {
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState({})
    const [order, setOrder] = useState({})
    const [errorMessage, setErrorMessage] = useState('')

    const fetchProducts = async () => {
        const { data } = await commerce.products.list()
        setProducts(data)
    }
    
    const fetchCart = async () => { setCart(await commerce.cart.retrieve()) }

    const handleAddToCart = async (productId, quantity) => {
        const { cart } = await commerce.cart.add(productId, quantity)
        setCart(cart)
    }

    const handleUpdateCartQty = async (productId, quantity) => {
        const { cart } = await commerce.cart.update(productId, { quantity })
        setCart(cart)
    }

    const handleRemoveFromCart = async (prodctId) => {
        const { cart } = await commerce.cart.remove(prodctId)
        setCart(cart)
    }

    const handleEmptyCart = async () => {
        const { cart } = await commerce.cart.empty()
        setCart(cart)
    }

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh()

        setCart(newCart)
    }

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder)

            setOrder(incomingOrder)
            refreshCart()
        } catch (error) {
            setErrorMessage(error.data.error.message)
        }
    }

    useEffect(() => {
        fetchProducts()
        fetchCart()
    }, [])

    // console.log(cart.line_items)

    return (
        <Router>
            <div>
                <Navigation totalItems={cart.total_items}/>
                <Switch>
                    <Route exact path='/'>
                        <Products products={ products } onAddToCart={handleAddToCart}/>
                    </Route>
                    <Route path='/cart'>
                        <Cart 
                            cart={cart}
                            handleUpdateCartQty={handleUpdateCartQty}
                            handleRemoveFromCart={handleRemoveFromCart}
                            handleEmptyCart={handleEmptyCart}
                        />
                    </Route>
                    <Route path='/checkout'>
                        <Checkout 
                            cart={cart}
                            order={order}
                            handleCaptureCheckout={handleCaptureCheckout}
                            error={errorMessage}
                        />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App
