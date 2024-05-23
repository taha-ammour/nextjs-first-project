// src/app/auth/error/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';

const Error = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div>
      <h1>Error</h1>
      <p>{error ? `Error: ${decodeURIComponent(error)}` : 'An unknown error occurred.'}</p>
    </div>
  );
};

export default Error;
