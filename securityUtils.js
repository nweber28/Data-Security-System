const crypto = require("crypto"); // for digital signatures

// Establish Digital Signature

function digitalSignature(data) {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  // Sign Data on Server
  const sign = crypto.createSign("SHA256");
  sign.update(JSON.stringify(data));
  const signature = sign.sign(privateKey, "base64");

  // Verify Signature on Client end
  const verify = crypto.createVerify("SHA256");
  verify.update(JSON.stringify(data));
  const isSignatureValid = verify.verify(publicKey, signature, "base64");
  console.log(isSignatureValid);
  return isSignatureValid;
}
//Funciton that generates a randomly created secure key
function generateSecretKey() {
  return crypto.randomBytes(32).toString("hex");
}

module.exports = { digitalSignature, generateSecretKey };
