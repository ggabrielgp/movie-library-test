/**
 * Exercise 01: The Retro Movie Store
 * Implement a shopping cart with the next features for the Movie Store that is selling retro dvds:
 * 1. Add a movie to the cart ✅
 * 2. Increment or decrement the quantity of movie copies. If quantity is equal to 0, the movie must be removed from the cart ✅
 * 3. Calculate and show the total cost of your cart. Ex: Total: $150
 * 4. Apply discount rules. You have an array of offers with discounts depending of the combination of movie you have in your cart.
 * You have to apply all discounts in the rules array (discountRules).
 * Ex: If m: [1, 2, 3], it means the discount will be applied to the total when the cart has all that products in only.
 * 
 * You can modify all the code, this component isn't well designed intentionally. You can redesign it as you need.
 */

import './assets/styles.css'
import { useState } from 'react'

export default function Exercise01 () {
  const movies = [
    {
      id: 1,
      name: 'Star Wars',
      price: 20
    },
    {
      id: 2,
      name: 'Minions',
      price: 25
    },
    {
      id: 3,
      name: 'Fast and Furious',
      price: 10
    },
    {
      id: 4,
      name: 'The Lord of the Rings',
      price: 5
    }
  ]

  const discountRules = [
    {
      m: [3, 2],
      discount: 0.25
    },
    {
      m: [2, 4, 1],
      discount: 0.5
    },
    {
      m: [4, 2],
      discount: 0.1
    }
  ]

  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Star Wars',
      price: 20,
      quantity: 2
    }
  ])

  const addToCart = (o) => {
    if (cart.some(x => x.id === o.id)) {
      incrementQty(o)
    } else {
      setCart(prev => [...prev, { ...o, quantity: 1 }])
    }
  }

  const incrementQty = (movie) => {
    setCart(prev => prev.map(x => x.id === movie.id ? { ...x, quantity: x.quantity + 1 } : x))
  }

  const decrementQty = (movie) => {
    const movieInCart = cart.find(x => x.id === movie.id)
    if (movieInCart.quantity > 1) {
      setCart(prev => prev.map(x => x.id === movie.id ? { ...x, quantity: x.quantity - 1 } : x))
    } else {
      setCart(prev => prev.filter(x => x.id !== movie.id))
    }
  }

  const calculateTotalPrice = () => {
    let repeatedIds = getRepeatedIds(cart) // [1,1,1,2,2]

    console.log("initial", repeatedIds)
    const discountRulesSorted = discountRules.sort((a, b) => b.discount - a.discount).map(rules => {
      let totalCombo = 0
      rules.m.map(id => {
        const { price } = movies.find(movie => movie.id === id)
        totalCombo += price - price * rules.discount
      })
      return { ...rules, quantity: 0, totalCombo }
    })

    discountRulesSorted.forEach(rule => {
      let validRule = rule.m.every(id => repeatedIds.some(item => item === id)) // false || true

      while (validRule) {
        rule.quantity += 1
        //removing ids by rule.m
        const idxToRemove = rule.m.map(id => repeatedIds.findIndex(item => item === id))
        let idxToRemoveSorted = idxToRemove.sort((a, b) => b - a)

        idxToRemoveSorted.forEach(idx => {
          repeatedIds.splice(idx, 1)
        })

        validRule = rule.m.every(id => repeatedIds.some(item => item === id))
      }
    });
    console.log("Resto de ids que no pertenecen a un combo", repeatedIds)

    const totalPriceByDiscount = discountRulesSorted.reduce((acc, item) => acc + (item.quantity * item.totalCombo), 0);

    const restMovies = cart.filter(movie => repeatedIds.some(id => movie.id === id))

    const totalPriceOfRest = restMovies.reduce((acc, item) => acc + (item.price * repeatedIds.filter(id => id === item.id).length), 0);

    return totalPriceByDiscount + totalPriceOfRest;
  };

  const getRepeatedIds = (movies) => {
    //flatMap => aplanar arrays
    return movies.flatMap(movie => Array(movie.quantity).fill(movie.id));
  };

  return (
    <section className="exercise01">
      <div className="movies__list">
        <ul>
          {movies.map(o => (
            <li className="movies__list-card">
              <ul>
                <li>
                  ID: {o.id}
                </li>
                <li>
                  Name: {o.name}
                </li>
                <li>
                  Price: ${o.price}
                </li>
              </ul>
              <button onClick={() => addToCart(o)}>
                Add to cart
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="movies__cart">
        <ul>
          {cart.map(x => (
            <li className="movies__cart-card">
              <ul>
                <li>
                  ID: {x.id}
                </li>
                <li>
                  Name: {x.name}
                </li>
                <li>
                  Price: ${x.price}
                </li>
              </ul>
              <div className="movies__cart-card-quantity">
                <button onClick={() => decrementQty(x)}>
                  -
                </button>
                <span>
                  {x.quantity}
                </span>
                <button onClick={() => incrementQty(x)}>
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="movies__cart-total">
          <p>Total: ${calculateTotalPrice()}</p>
        </div>
      </div>
    </section>
  )
} 