import { Component } from 'react';
import Context from '../utils/context';
import { Link } from 'react-router-dom';
import './products.css';
import * as Sentry from '@sentry/react';

console.log("window.location", window.location)
var BACKEND = ""
if (window.location.hostname === "localhost") {
  BACKEND = "http://localhost:8080"
} else {
  BACKEND = process.env.REACT_APP_BACKEND
}
console.log("BACKEND", BACKEND)

class Products extends Component {
  static contextType = Context;

  async componentDidMount(){
    // Sentry.captureException(new Error("products page"))
    
    let response = await fetch(`${BACKEND}/products`, {
      method: "GET",
    })
    .then(response => {return response.text()})
    .catch((err) => { throw Error(err) })
    console.log('Total items in response', JSON.parse(response).length)
    const { products } = this.context;
    products.update({ action: 'add', products: JSON.parse(response) })
    // return response
  }

  render() {
    const { cart, products } = this.context;
    return (
      <div>
        {/* <ul className="products-list">
          {products.map((product) => {
            const itemLink = '/product/' + product.id;
            return (
              <li key={product.id}>
                <div>
                  <Link to={itemLink}>
                    <img src={product.img} alt="product" />
                    <div>
                      <h2>{product.title}</h2>
                      <p className="product-description">
                        {product.description}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={() => cart.update({ action: 'add', product })}
                  >
                    Add to cart — ${product.price}.00
                  </button>
                </div>
              </li>
            );
          })}
        </ul> */}
      </div>
    );
  }
}

export default Sentry.withProfiler(Products, { name: "Products"})
