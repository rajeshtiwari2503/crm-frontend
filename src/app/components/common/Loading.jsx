import React from 'react'
import { ThreeDots } from 'react-loader-spinner'
// import { ColorRing } from 'react-loader-spinner'


export const ReactLoader = () => {
    return (
        <div className='flex   justify-center items-center'>
            <ThreeDots
                visible={true}
                height="80"
                width="80"
                color="#5396b9"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass="flex   justify-center items-center"
            />
        </div>
    )
}
