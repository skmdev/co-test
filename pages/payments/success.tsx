import { NextPage } from 'next';
import Link from 'next/link';

const SuccessPage: NextPage = () => {
  return (
    <div>
      Success page
      <Link href="/checkout" passHref>
        <button>Go to checkout</button>
      </Link>
    </div>
  );
};

export default SuccessPage;
