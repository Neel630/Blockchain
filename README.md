# Defi DApp

- Defi project where user can stake there dai coins to get dapp token in rewards

To Run locally

Start Ganache locally, clone this repository and run the following command in terminal

```
npm install --g truffle@5.1.39

```

To run test cases 
```
truffle test
```

To run blockchain locally
```
truffle migrate --reset
```
To run frontend
 ```
 npm start
 ```

To deploy contract on rinkiby
- Uncomment code in truffle-config and add mnemonic, rinkibyInfuraURL(can be obtain by creating project on Infura) 
- Run following command
```
truffle migrate --network rinkeby
```
