# XRPL Bookworm

This is a small command line tool that allows you to check the XRPL for "glitched" offers and subsequently fix them. These offers can happen due to the offer maker's account having such little funding that it results in a floating point precision error.

👉 Read about the technicalities of this glitch: [XLS-28](https://github.com/XRPLF/XRPL-Standards/discussions/74)

👉 Check out the patch amendment: [fixReducedOffersV1](https://github.com/XRPLF/rippled/pull/4512)

### What you need

 - Node.js 14+
 - NPM
 - The wallet seed of a XRPL Account holding at least 15 XRP

### Install

Clone to repo, then run

    npm install

Next, open `config.json` and fill the field `walletSeed`. **WARNING: The wallet you use here should not hold any tokens and have a low XRP balance, to avoid unwanted loss of funds. No warranty, obivously.**

### Check Book

To check if a specific orderbook currently is in a glitched state, run

    node cli check CURRENCY:ISSUER

where you replace `CURRENCY` and `ISSUER` with the currency code and issuing address respectively.

### Fix Book

To fix a specific orderbook, run

    node cli fix CURRENCY:ISSUER

### Test Book

To test how far off the glitched offer set the effective exchange rate, run

    node cli test CURRENCY:ISSUER


## Example case

When testing against the CasinoCoin book (CSC/XRP), it has shown that glitched offers can elevate the effective exchange rate up to 80% above the true market price. This was discovered by running:

    node cli test CSC:rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr

this yielded:

    *** XRPL BOOKWORM ***
    using node: wss://xrplcluster.com
    using wallet: rat1LqGrBQXjUrWQuzhc6o3APcVhpaqbYC
    
    highest offer funded rate deviates significantly from initial rate!
    offer id: CCE57E9B0E44CEA69E01F6BC7AF4D7CD674BE30EDBD0F12C7F032EB8F5CC22D3
    starting testing series
    trying to buy 0% above market price ...
    submitting [OfferCreate] ... tecKILLED
    trying to buy 10% above market price ...
    submitting [OfferCreate] ... tecKILLED
    trying to buy 20% above market price ...
    submitting [OfferCreate] ... tecKILLED
    trying to buy 30% above market price ...
    submitting [OfferCreate] ... tecKILLED
    trying to buy 40% above market price ...
    submitting [OfferCreate] ... tecKILLED
    trying to buy 50% above market price ...
    submitting [OfferCreate] ... tecKILLED
    trying to buy 60% above market price ...
    submitting [OfferCreate] ... tecKILLED
    trying to buy 70% above market price ...
    submitting [OfferCreate] ... tecKILLED
    trying to buy 80% above market price ...
    submitting [OfferCreate] ... tesSUCCESS
    unwedged offer book at +80% above market price
