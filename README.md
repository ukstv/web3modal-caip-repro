# Reproduction for a buggy Web3Modal SIWE support

Expectation:

1. A user signs in through SIWE flow ⇒ an application knows the person's address
2. A user reloads a page through Command+R ⇒ the application continues the session

Reality:

1. A user signs in through SIWE flow ⇒ the application knows the person's address
2. A user reloads a page through Command+R ⇒ **the application asks for a SIWE signature again**

It looks like Web3Modal SIWE flow forgets about a SIWE session. The root cause is that
Web3Modal [gets `caipAddress` property
initialized from `AccountController.state.address`](https://github.com/WalletConnect/web3modal/blob/V4/packages/scaffold/src/modal/w3m-modal/index.ts#L170) which _is not_ a CAIP address.

See how [`fix` branch](https://github.com/ukstv/web3modal-caip-repro/tree/fix) here applies a patch to initialize `caipAddress` from `AccountController.state.caipAddress`.
After you sign in and refresh a page, a user still is considered signed in, which is an expected behaviour.

# Usage

1. `pnpm install`
2. `pnpm run dev`
3. Open http://localhost:5173, click "Connect" button and go through SIWE flow.
4. Refresh the page. On `main` branch you'd see a SIWE signature prompt, on `fix` branch you are still considered signed in.