const API_URL = "http://localhost:3010/api";

document.getElementById("create-wallet").addEventListener("click", async () => {
  const response = await fetch(`${API_URL}/wallet`, { method: "POST" });
  const wallet = await response.json();
  const walletsList = document.getElementById("wallets-list");
  walletsList.innerHTML += `
    <div>
        <p><strong>Address:</strong> ${wallet.address}</p>
        <p><strong>Public Key:</strong> ${wallet.publicKey}</p>
        <p><strong>Private Key:</strong> ${wallet.privateKey}</p>
    </div>
  `;
});

document.getElementById("fetch-blocks").addEventListener("click", async () => {
  const response = await fetch(`${API_URL}/blocks`);
  const blocks = await response.json();
  const blocksList = document.getElementById("blocks-list");
  blocksList.innerHTML = blocks.map(
    (block, index) => `
        <div>
            <h4>Block #${index}</h4>
            <pre>${JSON.stringify(block, null, 2)}</pre>
        </div>
    `
  );
});

document
  .getElementById("create-transaction")
  .addEventListener("click", async () => {
    const sender = document.getElementById("sender").value;
    const receiver = document.getElementById("receiver").value;
    const amount = document.getElementById("amount").value;

    const response = await fetch(`${API_URL}/transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender, receiver, amount: Number(amount) }),
    });
    const result = await response.json();
    const status = document.getElementById("transactions-status");
    if (response.ok) {
      status.innerHTML = `
        <p style="color:green;">
            Transaction submitted success ${JSON.stringify(result)}
        </p>
        `;
    } else {
      status.innerHTML = `
        <p style="color:red;">
            Error: ${result.error}
        </p>
        `;
    }
  });
