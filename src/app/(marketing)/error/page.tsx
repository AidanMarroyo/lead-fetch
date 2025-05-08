import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 | SmartMomKit - Smart tools. Calm routines. Happier toddlers',
  description: 'This is Error page for SmartMomKit',
  // other metaDescription
};

const ErrorPage = () => {
  return (
    <main>
      <section className='pb-20 pt-39 lg:pb-25 lg:pt-44'>
        <div className='mx-auto w-full max-w-[598px] px-4 text-center sm:px-8 lg:px-0'>
          <Image
            src='/error.png'
            alt='404'
            className='mx-auto mb-12.5 w-1/2 sm:w-full'
            width={598}
            height={559}
          />
          {/* <h1 className='mb-5 text-heading-6 font-bold text-dark sm:text-heading-4 lg:text-heading-3'>
            Oops! Page Not Found.
          </h1>
          <p className='mb-7.5'>
            The page you are looking for is not available or has been moved. Try
            a different page or go to homepage with the button below.
          </p> */}
          <Link
            href='/'
            className='inline-flex rounded-md bg-dark px-6  font-medium  duration-300 ease-in hover:opacity-95'
          >
            Go To Home
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ErrorPage;
