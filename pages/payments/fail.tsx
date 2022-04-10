import { NextPage } from 'next';
import Link from 'next/link';

const FailPage: NextPage = () => {
  return (
    <div>
      Fail page
      <Link href="/checkout" passHref>
        <button>Go to checkout</button>
      </Link>
    </div>
  );
};

export default FailPage;
