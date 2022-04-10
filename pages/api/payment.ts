// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Data = {
  name: string;
};

const SECRET_KEY = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { type, host, token } = req.body;

  try {
    const { data } = await axios.post(
      `https://api.sandbox.checkout.com/payments`,
      {
        source: {
          type,
          purpose: 'testing',
          token,
        },
        amount: 2500,
        currency: 'EUR',
        success_url: `${host}/payments/success`,
        failure_url: `${host}/payments/fail`,
        '3ds': {
          enabled: true,
        },
      },
      { headers: { Authorization: SECRET_KEY } }
    );

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'payment error' } as any);
  }
}
