import loader from '../assets/loader.gif'

export default function Loader() {
  return (
    <div className="w-100 loader-container d-flex align-items-center justify-content-center">
      <img src={loader} alt="Loading" />
    </div>
  )
}
