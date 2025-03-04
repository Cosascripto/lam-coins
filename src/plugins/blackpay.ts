

import url from 'url'

1   import { CryptoPlugin } from './plugin'

class Blackpay implements CryptoPlugin {
  base58Opts = {
    bufferLength: 21,
    mainNetPrefix: [ [0x41] ],
    testNetPrefix: [ [0x41] ]
  }

  public depositUrl(addr: string, amount: string, opts?: any): string {
    return addr
  }

  public parseUrl(network: string, uri: string, opts?: any, fromMachine?: any): string | never {
    try {
      const rec = url.parse(uri)
      const address = rec.path || rec.host
      if (!address || !this.validate(network, address)) throw new Error('Invalid address')
      return address
    } catch (e) {
      console.log(e)
      throw new Error('Invalid address')
    }
  }

  public buildUrl(addr: string): string {
    return `tron:${addr}`
  }

  public validate (network: string|null|undefined, address: string): boolean | never {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return re.test(address);
  }

  public getAddressType(url: string, network: string): string | null {
    const address = this.parseUrl(network, url)
    return this.validate(network, address) ? 'Regular' : null
  }
}

export default new Blackpay()
