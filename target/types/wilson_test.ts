export type WilsonTest = {
  "version": "0.1.0",
  "name": "wilson_test",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "initialAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateValue",
      "accounts": [
        {
          "name": "storageAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "value",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "init",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "value",
            "type": "u64"
          }
        ]
      }
    }
  ]
};

export const IDL: WilsonTest = {
  "version": "0.1.0",
  "name": "wilson_test",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "initialAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateValue",
      "accounts": [
        {
          "name": "storageAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "value",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "init",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "value",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
