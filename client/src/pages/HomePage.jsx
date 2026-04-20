import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  DevicePhoneMobileIcon,
  ShoppingBagIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import api from '../utils/axiosInstance'

const categories = [
  { name: 'Electronics', value: 'electronics', icon: DevicePhoneMobileIcon },
  { name: 'Clothing', value: 'clothing', icon: ShoppingBagIcon },
  { name: 'Footwear', value: 'footwear', icon: StarIcon },
  { name: 'Accessories', value: 'accessories', icon: StarIcon },
]

const HomePage = () => {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products?limit=6')
        setProducts(res.data.products)
      } catch (err) {
        console.error(err)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Section ── */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Shop Everything You Need
          </h1>
          <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
            Discover thousands of products across electronics, clothing,
            footwear and accessories at the best prices.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/products')}
              className="bg-white text-indigo-600 font-semibold
                         px-8 py-3 rounded-lg hover:bg-indigo-50
                         transition-colors duration-200">
              Shop Now
            </button>
            <button
              onClick={() => navigate('/products')}
              className="border-2 border-white text-white font-semibold
                         px-8 py-3 rounded-lg hover:bg-indigo-700
                         transition-colors duration-200">
              Browse Categories
            </button>
          </div>
        </div>
      </section>

      {/* ── Features Strip ── */}
      <section className="bg-white border-b border-gray-200 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: TruckIcon, title: 'Free Shipping', desc: 'On all orders above ₹999' },
            { icon: ShieldCheckIcon, title: 'Secure Payments', desc: 'Powered by PayU gateway' },
            { icon: StarIcon, title: 'Top Quality', desc: 'Curated products only' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="bg-indigo-50 p-3 rounded-lg">
                <Icon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories Section ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(({ name, value, icon: Icon }) => (
            <div
              key={value}
              onClick={() => navigate(`/products?category=${value}`)}
              className="bg-white rounded-xl border border-gray-200 p-6
                         text-center cursor-pointer hover:border-indigo-400
                         hover:shadow-md transition-all duration-200">
              <div className="bg-indigo-50 w-12 h-12 rounded-lg
                              flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-sm font-medium text-indigo-600
                       hover:text-indigo-700 flex items-center gap-1">
            View All
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="bg-white rounded-xl border border-gray-200
                         hover:shadow-md transition-shadow duration-200
                         overflow-hidden">
              {/* Image placeholder */}
              <div className="bg-gray-100 h-48 flex items-center justify-center">
                {product.images?.length > 0
                  ? <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  : <p className="text-gray-400 text-sm">No image</p>
                }
              </div>
              {/* Product info */}
              <div className="p-4">
                <p className="text-gray-900 font-semibold truncate">
                  {product.name}
                </p>
                <p className="text-gray-500 text-sm mt-1 truncate">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-indigo-600 font-bold">
                    ₹{product.price}
                  </p>
                  <span className="text-xs bg-indigo-50 text-indigo-600
                                   px-2 py-1 rounded-full font-medium">
                    {product.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}

export default HomePage