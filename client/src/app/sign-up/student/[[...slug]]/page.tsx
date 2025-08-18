import React from 'react';
import Image from 'next/image';

// comp.
import SignUpForm from '@/app/_components/signUpform';
import CenterBlur from '@/app/_components/CenterBlur';

const SignUpPage = () => { 

    return(
        <div className=" h-[100vh] w-[100vw] bg-[rgb(3,8,22)] flex items-center justify-center">
        <CenterBlur />
        <Image
            className='z-[2]'
            src="/assests/signUp.png" // Adjust the path as necessary
            alt="Description of image"
            width={600}          // Desired width
            height={400}         // Desired height
        />

        <SignUpForm />
        </div>
    )
}

export default SignUpPage;
