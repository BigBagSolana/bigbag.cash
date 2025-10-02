// Helius RPC client for Solana

export interface SolanaTransaction {
  signature: string
  blockTime: number
  slot: number
  err: any
  memo?: string
}

export interface TokenHolder {
  walletAddress: string
  tokenAmount: number
  ticketCount: number
}

function getHeliusConfig() {
  const HELIUS_RPC_URL = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || ""
  const BIGBAG_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_MINT_ADDRESS || ""
  const TOKENS_PER_TICKET = Number(process.env.NEXT_PUBLIC_ENTRY_THRESHOLD) || 50000

  return {
    HELIUS_RPC_URL,
    BIGBAG_TOKEN_ADDRESS,
    TOKENS_PER_TICKET,
  }
}

export async function getRecentTransactions(walletAddress: string, limit = 10): Promise<SolanaTransaction[]> {
  try {
    const { HELIUS_RPC_URL } = getHeliusConfig()

    if (!HELIUS_RPC_URL) {
      console.error("Helius RPC URL not configured")
      return []
    }

    const response = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getSignaturesForAddress",
        params: [
          walletAddress,
          {
            limit,
          },
        ],
      }),
    })

    const data = await response.json()
    return data.result || []
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return []
  }
}

export async function getTransaction(signature: string) {
  try {
    const { HELIUS_RPC_URL } = getHeliusConfig()

    if (!HELIUS_RPC_URL) {
      console.error("Helius RPC URL not configured")
      return null
    }

    const response = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTransaction",
        params: [
          signature,
          {
            encoding: "jsonParsed",
            maxSupportedTransactionVersion: 0,
          },
        ],
      }),
    })

    const data = await response.json()
    return data.result
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return null
  }
}

export async function verifyPayment(
  signature: string,
  expectedAmount: number,
  recipientAddress: string,
): Promise<boolean> {
  const transaction = await getTransaction(signature)

  if (!transaction) return false

  // Verify transaction details
  // This is a simplified version - you'll need to adjust based on your specific payment structure
  const instructions = transaction.transaction.message.instructions

  // Check if transaction contains the expected payment
  // You'll need to implement proper verification logic based on your payment structure

  return true // Placeholder
}

export async function getTokenHolders(): Promise<TokenHolder[]> {
  try {
    const { HELIUS_RPC_URL, BIGBAG_TOKEN_ADDRESS, TOKENS_PER_TICKET } = getHeliusConfig()

    if (!HELIUS_RPC_URL || !BIGBAG_TOKEN_ADDRESS) {
      console.error("Missing required configuration")
      return []
    }

    // Get token accounts for the token
    const response = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getProgramAccounts",
        params: [
          "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", // SPL Token Program
          {
            encoding: "jsonParsed",
            filters: [
              {
                dataSize: 165, // Token account data size
              },
              {
                memcmp: {
                  offset: 0,
                  bytes: BIGBAG_TOKEN_ADDRESS,
                },
              },
            ],
          },
        ],
      }),
    })

    const data = await response.json()

    if (!data.result) {
      console.error("No token holders found")
      return []
    }

    // Process holders and calculate tickets
    const holders: TokenHolder[] = []

    for (const account of data.result) {
      const parsedInfo = account.account.data.parsed?.info
      if (!parsedInfo) continue

      const tokenAmount = parsedInfo.tokenAmount?.uiAmount || 0
      const walletAddress = parsedInfo.owner

      // Only include holders with minimum tokens
      if (tokenAmount >= TOKENS_PER_TICKET) {
        const ticketCount = Math.floor(tokenAmount / TOKENS_PER_TICKET)
        holders.push({
          walletAddress,
          tokenAmount,
          ticketCount,
        })
      }
    }

    console.log(`Found ${holders.length} eligible holders`)
    return holders
  } catch (error) {
    console.error("Error fetching token holders:", error)
    return []
  }
}

// Alternative method using Helius DAS API (more reliable)
export async function getTokenHoldersViaHelius(): Promise<TokenHolder[]> {
  try {
    const { HELIUS_RPC_URL, BIGBAG_TOKEN_ADDRESS, TOKENS_PER_TICKET } = getHeliusConfig()

    if (!HELIUS_RPC_URL || !BIGBAG_TOKEN_ADDRESS) {
      console.error("Missing required configuration")
      return []
    }

    const response = await fetch(`${HELIUS_RPC_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "helius-holders",
        method: "getTokenAccounts",
        params: {
          mint: BIGBAG_TOKEN_ADDRESS,
          limit: 10000,
        },
      }),
    })

    const data = await response.json()

    if (!data.result?.token_accounts) {
      console.log("Using fallback method for token holders")
      return getTokenHolders()
    }

    const holders: TokenHolder[] = []

    for (const account of data.result.token_accounts) {
      const tokenAmount = account.amount / Math.pow(10, account.decimals || 9)
      const walletAddress = account.owner

      if (tokenAmount >= TOKENS_PER_TICKET) {
        const ticketCount = Math.floor(tokenAmount / TOKENS_PER_TICKET)
        holders.push({
          walletAddress,
          tokenAmount,
          ticketCount,
        })
      }
    }

    console.log(`Found ${holders.length} eligible holders`)
    return holders
  } catch (error) {
    console.error("Error with Helius API, using fallback:", error)
    return getTokenHolders()
  }
}
