// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {item} = props
  const {imgUrl, title, price, brand, rating} = item
  return (
    <li className="l-cont">
      <img src={imgUrl} alt="similar product {title}" className="ls-img" />
      <h1 className="ls-head-1">{title}</h1>
      <p>by {brand}</p>
      <div className="card-1">
        <p className="ls-par-1">RS {price}/-</p>
        <div className="rate-cont">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="lsr-img"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
