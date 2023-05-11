// Write your code here
import {Component} from 'react'

import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productList: [],
    threeProducts: [],
    cartValue: 1,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({apiStatus: apiStatusConstants.progress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        availability: fetchedData.availability,
        brand: fetchedData.brand,
        description: fetchedData.description,
        id: fetchedData.id,
        imgUrlOne: fetchedData.image_url,
        price: fetchedData.price,
        rating: fetchedData.rating,
        title: fetchedData.title,
        totalReviews: fetchedData.total_reviews,
        similarProducts: fetchedData.similar_products,
      }
      this.setState({productList: updatedData})
      const {similarProducts} = updatedData
      const threeListUpdate = similarProducts.map(e => ({
        availability: e.availability,
        description: e.description,
        id: e.id,
        imgUrl: e.image_url,
        price: e.price,
        rating: e.rating,
        style: e.style,
        title: e.title,
        totalReviews: e.total_reviews,
        brand: e.brand,
      }))
      this.setState({threeProducts: threeListUpdate})
      this.setState({apiStatus: apiStatusConstants.success})
      console.log(threeListUpdate)
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {productList, threeProducts, cartValue} = this.state
    const {
      imgUrlOne,
      title,
      availability,
      brand,
      description,
      rating,
      totalReviews,
      price,
    } = productList
    return (
      <>
        <Header />
        <div className="bg-container">
          <img src={imgUrlOne} alt="product" className="f1-img" />
          <div className="main-card">
            <h1 className="ps-head-1">{title}</h1>
            <p className="ps-par-1">RS {price}/-</p>
            <div className="ps-card-1">
              <div className="rate-cont">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="lsr-img"
                />
              </div>
              <p className="ps-par-2">{totalReviews} Reviews</p>
            </div>
            <p className="ps-par-3">{description}</p>
            <div className="available-cont">
              <p className="ps-par-4">Available: </p>
              <p className="s-par">{availability}</p>
            </div>
            <div className="available-cont">
              <p className="ps-par-4">Brand: </p>
              <p className="s-par">{brand}</p>
            </div>
            <hr />
            <div className="card-2">
              <button type="button" onClick={this.minusValue} className="hi-ps">
                <BsDashSquare className="plus-style" />
              </button>

              <p className="ps-l-par">{cartValue}</p>
              <button type="button" onClick={this.plusValue} className="hi-ps">
                <BsPlusSquare className="plus-style" />
              </button>
            </div>
            <button
              type="button"
              className="butt-ps-s"
              onClick={this.cartButton}
            >
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="head-1">Similar Products</h1>
        <ul className="list-container">
          {threeProducts.map(e => (
            <SimilarProductItem key={e.id} item={e} />
          ))}
        </ul>
      </>
    )
  }

  renderLoader = () => (
    <div className="loader-cont">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <>
      <Header />
      <div className="bg-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="f-img"
        />
        <h1>Product Not Found</h1>
        <button type="button" onClick={this.clickButton} className="butt">
          Continue Shopping
        </button>
      </div>
    </>
  )

  clickButton = () => {
    const {history} = this.props
    history.replace('/products')
  }

  cartButton = () => {
    const {history} = this.props
    history.replace('/cart')
  }

  minusValue = () => {
    const {cartValue} = this.state
    if (cartValue > 1) {
      this.setState(prevState => ({cartValue: prevState.cartValue - 1}))
    }
  }

  plusValue = () => {
    this.setState(prevState => ({cartValue: prevState.cartValue + 1}))
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.progress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
