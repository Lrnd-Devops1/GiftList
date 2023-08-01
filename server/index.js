const express = require('express');
const verifyProof = require('../utils/verifyProof');
const MerkleTree = require('../utils/MerkleTree');
const niceList = require('../utils/niceList');
const port = 1225;

const app = express();
app.use(express.json());

// TODO: hardcode a merkle root here representing the whole nice list
// paste the hex string in here, without the 0x prefix
const MERKLE_ROOT = '';
const merkleTree = new MerkleTree(niceList);
const root = merkleTree.getRoot();
const giftItems = [
  "A cozy blanket",
  "A set of scented candles",
  "A stylish watch",
  "A gourmet chocolate gift box",
  "A personalized photo frame",
  "A potted indoor plant",
  "A high-quality leather wallet",
  "A portable Bluetooth speaker",
  "A classic novel or book set",
  "A cooking or baking kit",
];
app.post('/gift', (req, res) => {
  // grab the parameters from the front-end here
  const { name } = req.body;
  const index = niceList.findIndex(n => n === name);
  const proof = merkleTree.getProof(index);
  // TODO: prove that a name is in the list 
  const isInTheList = verifyProof(proof, name, root);
  if (isInTheList) {
    const random = Math.floor(Math.random() * giftItems.length);
    res.send(giftItems[random]);
  }
  else {
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
