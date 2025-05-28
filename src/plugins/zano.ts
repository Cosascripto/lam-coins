import { CryptoPlugin } from "./plugin";

class ZANO implements CryptoPlugin {
  public parseUrl(network: string, url: string): string | never {
    if (!url.startsWith("zano:")) {
      // It might be only the direct address
      if (!this.validate(url)) throw new Error("Invalid address");
      return url;
    }

    const afterPrefix = url.slice(5); // remove 'zano:'

    // Try to parse query params
    const params = new URLSearchParams(afterPrefix);
    const address = params.get("address");

    if (address && this.validate(address)) {
      return address;
    }

    // If there's no 'address=' in query, it might be the direct address
    if (this.validate(afterPrefix)) {
      return afterPrefix;
    }

    throw new Error("Invalid address");
  }

  public buildUrl(address: string): string {
    return `zano:${address}`;
  }

  public depositUrl(address: string, amount: string): string {
    return `zano:action=send&address=${address}&amount=${amount}`;
  }

  public validate(address: string): boolean {
    // Standard addresses: 98 characters, start with Z
    const standard = /^Z[a-zA-Z0-9]{97}$/.test(address);
    // Integrated addresses: 106 characters, start with i
    const integrated = /^i[a-zA-Z0-9]{105}$/.test(address);
    return standard || integrated;
  }

  public getAddressType(address: string, network: string): string | null {
    if (/^Z[a-zA-Z0-9]{97}$/.test(address)) return 'standard'
    if (/^i[a-zA-Z0-9]{105}$/.test(address)) return 'integrated'
    return null
  }
}

export default ZANO;
