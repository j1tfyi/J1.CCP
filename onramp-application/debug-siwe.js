// This file is used to debug the 'siwe' module import issue
try {
  const siwe = require("siwe");
  console.log("SIWE module loaded successfully:", siwe);
} catch (error) {
  console.error("Error loading SIWE module:", error);
}
