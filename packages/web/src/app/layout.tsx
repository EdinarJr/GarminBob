import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Garmin Training AI',
  description: 'Sistema inteligente de análise e geração de treinos personalizados',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center">
                  <span className="text-2xl">🏃‍♂️</span>
                  <h1 className="ml-2 text-xl font-bold text-gray-900">
                    Garmin Training AI
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="/" className="text-gray-700 hover:text-gray-900 font-medium">
                    Início
                  </a>
                  <a href="/atividades" className="text-gray-700 hover:text-gray-900">
                    Atividades
                  </a>
                  <a href="/analise-ia" className="text-gray-700 hover:text-gray-900">
                    Análise IA
                  </a>
                  <a href="/treinos" className="text-gray-700 hover:text-gray-900">
                    Treinos
                  </a>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

// Made with Bob
