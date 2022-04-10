import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>CO test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Link href="/checkout" passHref>
        <button>Go to checkout</button>
      </Link>
    </div>
  );
};

export default Home;
