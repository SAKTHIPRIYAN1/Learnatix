
import React from 'react';
import CenterBlur from './_components/CenterBlur';
import Login from './_components/LoginForm';
import Image from 'next/image';

const HomePage = () => {
  return (
    <div className=" h-[100vh] w-[100vw] bg-[rgb(3,8,22)] flex items-center justify-center">
      <CenterBlur />
      <Image
        className='z-[2]'
        src="/assests/StudentImage.png" // Adjust the path as necessary
        alt="Description of image"
        width={550}          // Desired width
        height={400}         // Desired height
      />

      <Login />
    </div>
  );
};

export default HomePage;

