document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("registerBtn");
  const loginBtn = document.getElementById("loginBtn");

  if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
      try {
        const challenge = new Uint8Array(32);
        crypto.getRandomValues(challenge);

        const publicKey = {
          challenge,
          rp: { name: "Demo Site" },
          user: {
            id: new Uint8Array(16),
            name: "demo@example.com",
            displayName: "Demo User",
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
          timeout: 60000,
          attestation: "none",
        };

        await navigator.credentials.create({ publicKey });

        openPopup('popuplcrs')
      } catch (err) {
        openPopup('popuplcrf')
        console.error(err);
      }
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      try {
        const challenge = new Uint8Array(32);
        crypto.getRandomValues(challenge);

        const publicKey = {
          challenge,
          timeout: 60000,
          userVerification: "required",
        };

        await navigator.credentials.get({ publicKey });

        alert("Authentication successful ✅");
      } catch (err) {
        openPopup('popuplcvf')
        console.error(err);
      }
    });
  }
});
