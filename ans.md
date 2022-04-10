- Request 01
  - Problem: missing the ApiSecretKey in request header - Authorization
  - Solution: put the ApiSecretKey to header Authorization, e.g. `Authorization: sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx`, [details](https://api-reference.checkout.com/#section/Authentication/ApiSecretKey)

- Request 02
  - Problem: provided the wrong amount in body payload,
  - Solution: provide the correct format according to [details](https://www.checkout.com/docs/resources/calculating-the-value), like `amount: 1000`

- Request 03
  - Problem: provided the wrong currency in body payload, Sofort supported `EUR` instead of `USD`
  - Solution: update the amount and using `EUR` as the currency, [details](https://www.checkout.com/docs/payments/payment-methods/bank-transfers/sofort)

- Request 04 
  - Problem: providing the testing amount ended with `05`, which may result - Declined - Do not honour
  - Solution: update the expiry date to `01/2099` and it will bypass the testing amount, [details](https://www.checkout.com/docs/testing/response-code-testing#Bypassing_the_response_codes)

- Request 05 
  - Problem: using the wrong type in body payload
  - Solution: update the value to `type: "id"` for using existing card, and add `cvv: "100"` in to the body payload, [details](https://www.checkout.com/docs/payments/accept-payments/pay-with-stored-details#Request_a_payment_using_an_existing_card)
