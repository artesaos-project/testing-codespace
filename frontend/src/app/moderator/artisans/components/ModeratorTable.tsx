'use client'

import { Button } from "@/components/ui/button";
import { BsXLg } from "react-icons/bs";
import { FaCheck } from "react-icons/fa6";
import { LuPencil } from "react-icons/lu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Artisan = {
  id: string;
  artisanName: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE';
};

interface ModeratorTableProps {
  searchTerm: string;
  activeFilter: string;
  artisans: Artisan[];
  onRefresh: () => void;
}

function ModeratorTable({ searchTerm, activeFilter, artisans, onRefresh }: ModeratorTableProps) {
  const [filteredArtisans, setFilteredArtisans] = useState<Artisan[]>([])
  const router = useRouter()

  const statusTranslated: Record<string, string> = {
    'PENDING': 'Pendente',
    'APPROVED': 'Aprovado',
    'REJECTED': 'Recusado',
    'INACTIVE': 'Inativo',
  };

  useEffect(() => {
    let filtered = artisans;

    if (searchTerm.trim()) {
      filtered = filtered.filter(artisan =>
        artisan.artisanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilter !== 'all') {
      filtered = filtered.filter(artisan => artisan.status === activeFilter);
    }

    setFilteredArtisans(filtered);
  }, [artisans, searchTerm, activeFilter]);

  const handleApprove = async (artisanId: string) => {

    try {
      const response = await fetch(`https://verbose-space-dollop-jwg7vpv9v64fq9x9-3333.app.github.dev/artisan-applications/${artisanId}/moderate`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'APPROVED' })

      })

      if (response.ok) {
        console.log(`artesao aprovado`)
        // Atualiza a lista após aprovação
        onRefresh()
      } 

    } catch (error) {
      console.error('Erro ao aprovar artesão: ', error)
    }
  }
  
  const handleRejection = async (artisanId: string) => {
    try {
      const response = await fetch(`https://verbose-space-dollop-jwg7vpv9v64fq9x9-3333.app.github.dev/artisan-applications/${artisanId}/moderate`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'REJECTED' })

      })

      if (response.ok) {
        console.log(`artesao rejeitado`)
        // Atualiza a lista após rejeição
        onRefresh()
      } 
    } catch (error) {
      console.error('Erro ao rejeitar artesão: ', error)
    }
  }


  return (
    <div>
      <table className="w-2/3 mx-auto mt-10 text-center text-midnight border-b border-midnight text-sm">
        <thead className="bg-baby-blue">
          <tr>
            <th scope="col" className="font-semibold p-2 text-sm rounded-tl-md ring-[0.5px]">Nome</th>
            <th scope="col" className="font-semibold text-sm ring-[0.5px] hidden md:table-cell">Email</th>
            <th scope="col" className="font-semibold px-6 text-sm ring-[0.5px] hidden md:table-cell">Status</th>
            <th scope="col" className="font-semibold text-sm rounded-tr-md ring-[0.5px]">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredArtisans.map((artisan) => {
            let actionCell;

            if (artisan.status === "PENDING") {
              actionCell = (
                <div className="flex py-1 justify-center items-center gap-2.5">
                  <Button className="h-6 text-xs my-1 bg-green-600 cursor-pointer" aria-label="Aprovar artesão" onClick={() => handleApprove(artisan.id)} asChild>
                    <div><FaCheck className="text-white" />
                      <p className="hidden md:inline">APROVAR</p>
                    </div>
                  </Button>
                  <Button className="h-6 text-xs my-1 bg-yellow-600/75 cursor-pointer" aria-label="Editar artesão" asChild>
                    <div><LuPencil className="text-white" />
                      <p className="hidden md:inline">EDITAR</p>
                    </div>
                  </Button>
                  <Button className="h-6 text-xs my-1 bg-red-700 cursor-pointer" aria-label="Recusar artesão" onClick={() => handleRejection(artisan.id)}>
                    <div className="flex items-center gap-2">
                      <BsXLg className="text-white" />
                      <p className="hidden md:inline">RECUSAR</p>
                    </div>
                  </Button>
                </div>
              );
            } else if (artisan.status === "APPROVED") {
              actionCell = (
                <div className="flex justify-center items-center gap-2.5">
                  <Button className="h-6 text-xs my-1 bg-yellow-600/75 cursor-pointer" aria-label="Editar artesão" asChild>
                    <div><LuPencil className="text-white" />
                      <p className="hidden md:inline">EDITAR</p>
                    </div>
                  </Button>
                  <Button className="h-6 text-xs my-1 md:bg-white font-bold border border-red-600 bg-red-600 text-red-600 cursor-pointer" aria-label="Desativar artesão" asChild>
                    <div>
                      <BsXLg className="text-white md:text-red-600" />
                      <p className="hidden md:inline">DESATIVAR</p>
                    </div>
                  </Button>
                </div>
              );
            } else if (artisan.status === "REJECTED") {
              actionCell = (
                <div className="flex justify-center items-center gap-2.5">
                  <Button className="h-6 text-xs my-1 bg-green-600 cursor-pointer" aria-label="Aprovar artesão" onClick={() => handleApprove(artisan.id)} asChild>
                    <div><FaCheck className="text-white" />
                      <p className="hidden md:inline">APROVAR</p>
                    </div>
                  </Button>
                  <Button className="h-6 text-xs my-1 bg-yellow-600/75 cursor-pointer" aria-label="Editar artesão" asChild>
                    <div><LuPencil className="text-white" />
                      <p className="hidden md:inline">EDITAR</p>
                    </div>
                  </Button>
                </div>
              );
            } else if (artisan.status === "INACTIVE") {
              actionCell = (
                <div className="flex justify-center items-center gap-2.5">
                  <Button className="h-6 text-xs my-1 bg-green-600 md:bg-white border border-green-600 text-green-600 cursor-pointer" aria-label="Aprovar artesão" asChild>
                    <div><FaCheck className="text-white md:text-green-600" />
                      <p className="hidden md:inline">ATIVAR</p></div>
                  </Button>
                  <Button className="h-6 text-xs my-1 bg-yellow-600/75 cursor-pointer" aria-label="Editar artesão" asChild>
                    <div>
                      <LuPencil className="text-white" />
                      <p className="hidden md:inline">EDITAR</p>
                    </div>
                  </Button>
                </div>
              );
            }

            return (
              <tr key={artisan.id} className="h-9">
                <td className="ring-[0.5px]">
                  <Link href={`/moderator/artisans/${artisan.id}`} className="hover:font-semibold transition underline">
                    {artisan.artisanName}
                  </Link>
                </td>
                <td className="ring-[0.5px] hidden md:table-cell ">{artisan.email}</td>
                <td className="font-semibold ring-[0.5px] hidden md:table-cell">{statusTranslated[artisan.status]}</td>
                <td className="ring-[0.5px]">{actionCell}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ModeratorTable;
