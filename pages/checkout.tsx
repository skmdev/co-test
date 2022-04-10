import { NextPage } from 'next';
import { Frames, CardNumber, ExpiryDate, Cvv } from 'frames-react';
import styles from '../styles/Home.module.css';
import Script from 'next/script';
import Image from 'next/image';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const PUBLIC_KEY = 'pk_test_4296fd52-efba-4a38-b6ce-cf0d93639d8a';

const config: any = {
  debug: true,
  publicKey: PUBLIC_KEY,
  localization: 'DE-DE',
  style: {
    base: {
      fontSize: '17px',
    },
  },
};

type DescProps = {
  title: any;
  value: any;
};

const Divider = () => {
  return (
    <div className={styles.divider}>
      <div className={styles.dividerLine} />
      Or
      <div className={styles.dividerLine} />
    </div>
  );
};

const Desc: React.FC<DescProps> = (props) => {
  return (
    <div className={styles.descContainer}>
      <div className={styles.title}>{props.title}</div>
      <div>{props.value}</div>
    </div>
  );
};

const Checkout: NextPage = () => {
  const [hasError, setHasError] = useState({
    number: false,
    expiry: false,
    cvv: false,
  });
  const [amount, setAmount] = useState(25);
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [paymentIconPath, setPaymentIconPath] = useState<string>();

  const router = useRouter();

  const pay = async (type: 'token' | 'giropay', token?: string) => {
    setLoading(true);

    const resp = await axios.post(`/api/payment`, {
      type,
      host: window.origin,
      token,
    });

    if (resp.data._links?.redirect?.href) {
      router.push(resp.data._links?.redirect?.href);
      return;
    }

    if (resp.data.status === 'Authorized') {
      router.push('/payments/success');
    } else {
      router.push('/payments/fail');
    }

    setLoading(false);
  };

  const initFrame = () => {
    Frames.init(config);
    Frames.addEventHandler('paymentMethodChanged', handlePaymentMethodChanged);
    Frames.addEventHandler('cardValidationChanged', cardValidationChanged);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { token } = await Frames.submitCard();
    await pay('token', token);

    setLoading(false);
  };

  const cardValidationChanged = () => {
    setCanSubmit(Frames.isCardValid());
  };

  const handlePaymentMethodChanged = (e?: any) => {
    const pm = e.paymentMethod;

    if (!pm) {
      setPaymentIconPath(undefined);
    } else {
      const name = pm.toLowerCase();

      setPaymentIconPath(`/images/card-icons/${name}.svg`);
      setHasError({ ...hasError, number: false });
    }
  };

  return (
    <div className={styles.container}>
      <Script
        src="https://cdn.checkout.com/js/framesv2.min.js"
        onLoad={initFrame}
        async={false}
      />
      <div className={styles.header}>
        <Image
          src={`/logo.png`}
          className={styles.logo}
          alt="card-brand"
          height={45}
          width={45}
        />
        <div className={styles.headerTitle}>Test</div>
      </div>
      <div className={styles.paymentPanel}>
        <div className={styles.itemContainer}>
          <h2>Order details:</h2>
          <div className={styles.itemList}>
            <Desc title="Dog Toys X 1" value={15} />
            <Desc title="Cat Toys X 1" value={10} />
          </div>
          <Desc title={<h3>Total: </h3>} value={25} />
        </div>
        <div className={styles.paymentForm}>
          <div className={styles.paymentAccept}>
            Payment accepts:
            <Image
              src={`/images/card-icons/visa.svg`}
              alt="card-brand"
              height={50}
              width={50}
            />
            <Image
              src={`/images/card-icons/american express.svg`}
              alt="card-brand"
              height={50}
              width={50}
            />
            <Image
              src={`/images/card-icons/mastercard.svg`}
              alt="card-brand"
              height={50}
              width={50}
            />
          </div>
          <Frames config={config} cardTokenized={(e) => {}}>
            <div className="input-container card-number">
              <div className="icon-container">
                <Image
                  id="icon-card-number"
                  src={paymentIconPath || '/images/card-icons/card.svg'}
                  alt="PAN"
                  // layout="fill"
                  height={20}
                  width={20}
                />
              </div>
              <CardNumber />
              {hasError.number && (
                <div className="icon-container">
                  <Image
                    id="icon-card-number-error"
                    src="/images/card-icons/error.svg"
                    alt="error"
                    height={20}
                    width={20}
                  />
                </div>
              )}
            </div>
            <div className="date-and-code">
              <div>
                <label htmlFor="expiry-date">Expiry date</label>
                <div className="input-container expiry-date">
                  <div className="icon-container">
                    <Image
                      id="icon-expiry-date"
                      src="/images/card-icons/exp-date.svg"
                      alt="Expiry date"
                      height={20}
                      width={20}
                    />
                  </div>
                  <ExpiryDate />
                  {hasError.expiry && (
                    <div className="icon-container">
                      <Image
                        id="icon-expiry-date-error"
                        src="/images/card-icons/error.svg"
                        height={20}
                        width={20}
                        alt="error"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="cvv">Security code</label>
                <div className="input-container cvv">
                  <div className="icon-container">
                    <Image
                      id="icon-cvv"
                      src="/images/card-icons/cvv.svg"
                      alt="CVV"
                      height={20}
                      width={20}
                    />
                  </div>
                  <Cvv />
                  {hasError.cvv && (
                    <div className="icon-container">
                      <Image
                        id="icon-cvv-error"
                        src="/images/card-icons/error.svg"
                        height={20}
                        width={20}
                        alt="error"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              id="pay-button"
              disabled={loading || !canSubmit}
            >
              {loading ? 'Paying...' : `PAY EUR ${amount.toFixed(2)}`}
            </button>

            <Divider />

            <button
              onClick={() => pay('giropay')}
              id="pay-button"
              disabled={loading}
            >
              {loading ? 'Paying...' : `Giro Pay`}
            </button>
          </Frames>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
