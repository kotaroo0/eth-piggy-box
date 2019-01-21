var PiggyBankABI = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "piggyBanks",
      "outputs": [
        {
          "name": "id",
          "type": "uint256"
        },
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "savingAmount",
          "type": "uint256"
        },
        {
          "name": "goalAmount",
          "type": "uint256"
        },
        {
          "name": "isActive",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x3c6bb3f9"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "userAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "goalAmount",
          "type": "uint256"
        }
      ],
      "name": "Create",
      "type": "event",
      "signature": "0x278b0fd0170e87df8d6e9c94b47d3ff7382de693c547e6089b53f9972c532389"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "userAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "savingAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "goalAmount",
          "type": "uint256"
        }
      ],
      "name": "Deposit",
      "type": "event",
      "signature": "0x7162984403f6c73c8639375d45a9187dfd04602231bd8e587c415718b5f7e5f9"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "userAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Destroy",
      "type": "event",
      "signature": "0x16b35c733876ade87e5062332519f2666918ff4b5a284a7f4625c231cda6ff28"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "goalAmount",
          "type": "uint256"
        }
      ],
      "name": "create",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x780900dc"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "deposit",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function",
      "signature": "0xb6b55f25"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "destroy",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x9d118770"
    }
  ];