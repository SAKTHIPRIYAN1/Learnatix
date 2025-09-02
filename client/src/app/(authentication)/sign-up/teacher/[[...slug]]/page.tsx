import React from 'react';
import Image from 'next/image';

// comp.
import SignUpTeacherForm from '@/_components/(teacherComponents)/signUpTeacher';
import CenterBlur from '@/_components/utilsComponents/CenterBlur';

const SignUpPage = () => { 

    return(
        <div className="  h-[100vh] w-[100vw] gap-4 bg-[rgb(3,8,22)] flex items-center justify-center">
        <CenterBlur />
        <Image
            className='z-[2]'
            src="/assests/teacherImage.png" 
            alt="Description of image"
            width={600}          // Desired width
            height={600}         // Desired height
        />

        <SignUpTeacherForm />
        </div>
    )
}

export default SignUpPage;
