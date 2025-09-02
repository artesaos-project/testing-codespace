'use client'

import React, { useState, useEffect } from 'react'
import ModeratorHeader from '../components/ModeratorHeader'
import ModeratorTitle from '../components/ModeratorTitle'
import ModeratorSearch from './components/ModeratorSearch'
import ModeratorTable from './components/ModeratorTable'
import { useRouter } from 'next/navigation'

type Artisan = {
  id: string;
  artisanName: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE';
};

function page() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  const fetchArtisans = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('https://verbose-space-dollop-jwg7vpv9v64fq9x9-3333.app.github.dev/artisan-applications', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
        credentials: 'include',
      })

      if (response.status === 403) {
        router.replace('/')
        return
      }

      if (response.ok) {
        const result = await response.json()
        setArtisans(result.artisanApplications)
        setIsAuthorized(true)
      } else {
        router.replace('/')
      }

    } catch (error) {
      console.error('Erro ao buscar artesãos: ', error)
      router.replace('/')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchArtisans()
  }, [])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
  }

  // Tela de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-midnight mx-auto mb-4"></div>
          <p className="text-midnight font-semibold">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não autorizado, não renderiza nada (já redirecionou)
  if (!isAuthorized) {
    return null
  }

  return (
    <div className='overflow-x-hidden'>
      <ModeratorHeader />
      <ModeratorTitle title={'Artesãos'} />
      <ModeratorSearch 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />
      <ModeratorTable 
        searchTerm={searchTerm}
        activeFilter={activeFilter}
        artisans={artisans}
        onRefresh={fetchArtisans}
      />
    </div>
  )
}

export default page