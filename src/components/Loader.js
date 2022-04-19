import { Spinner } from 'reactstrap'

export default function Loader() {
  return (
    <div className='d-flex justify-content-center pt-4'>
      <Spinner color="white" />
    </div>
  )
}
