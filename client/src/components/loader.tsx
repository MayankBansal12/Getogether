// PropagateLoader
import PropagateLoader from 'react-spinners/PropagateLoader'

type Props = {}

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center items-center gap-2 w-screen h-screen">
      <div>
        <PropagateLoader
          color={'#36d7b7'}
          // loading={true}
          cssOverride={{
            height: '35px',
            width: '35px',
          }}
          size={35}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
      <h1 className="mt-3 font-semibold text-2xl">Loading</h1>
    </div>
  )
}

export default Loader
