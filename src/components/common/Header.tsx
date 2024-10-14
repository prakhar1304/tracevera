import { ConnectWallet } from '@thirdweb-dev/react'
import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="bg-black text-white py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold hover:text-primary transition-colors">
        Samaj
      </Link>
      <ConnectWallet />
    </header>
  )
}