# Liqu1tent - Crosschain intent swaps via Layer Zero

## Overview

Liqu1tent is a crosschain intent swap protocol that allows users to swap assets across different blockchains. It is built on top of the Layer Zero protocol, which is a decentralized messaging protocol for sending messages across different blockchains.

## Schema

<img src="./Liqu1tent Diagram.svg">

## How It Works

- A user that wants to swap from a source chain creates an intent by presigning an order which is stored in a database and accesible via an API.
  - The status of the order is 'NEW' at this point.
- Fillers query the order database for intents and initiates the process on the source chain by locking up the users funds.
  - The source funds are locked in a smart contract on the source chain throught the Liqu1tent smart contract.
  - The status of the order is updated to 'INITIATED' at this point.
- The filler fulfills the order on the destination chain by sending the funds to the user through the Liqu1tent smart contract.
  - The funds are being sent to the user on the destination chain.
  - The status of the order is updated to 'FULFILLED' at this point.
- Proof will be sent to the source chain to unlock the funds in the benefit of the filler.
  - A message is being sent from the destination chain to the source chain using Layer Zero.
  - The locked up funds on the source chain are being unlocked and sent to the filler.
  - The status of the order is updated to 'COMPLETED' at this point.
