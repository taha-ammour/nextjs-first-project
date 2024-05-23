// src/app/auth/signout/page.tsx

'use client';

import { signOut } from 'next-auth/react';

const SignOut = () => {
  return (
    <div>
      <h1>Sign Out</h1>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default SignOut;
