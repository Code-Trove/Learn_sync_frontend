'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Navigation() {
  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-xl">Buffer</Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/create" className="text-blue-600">Create</Link>
            <Link href="/publish">Publish</Link>
            <Link href="/analyze">Analyze</Link>
            <Link href="/engage">Engage</Link>
            <Link href="/start">Start Page</Link>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="outline">Invite Your Team</Button>
          <Button>New</Button>
        </div>
      </div>
    </nav>
  )
}

