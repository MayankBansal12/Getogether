import React from 'react'
import { SyncLoader } from 'react-spinners'

const ScreenLoader = ({ styl = '' }) => {
  return (
    <div className={`flex w-full h-full justify-center items-center ${styl}`}>
      <SyncLoader
        color={'#8477D7'}
        // loading={true}
        cssOverride={{
          height: '10px',
          width: '100px',
          gap: '3px',
        }}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  )
}

export default ScreenLoader
