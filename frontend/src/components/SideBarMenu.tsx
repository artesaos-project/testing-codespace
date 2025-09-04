"use client";
import {
  IoMenu,
  IoChevronForward,
  IoChevronDownOutline,
} from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { TbArrowsExchange, TbLogout2 } from "react-icons/tb";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { BsGear } from "react-icons/bs";
import { RxPlusCircled } from "react-icons/rx";
import { CgDanger } from "react-icons/cg";
import { IoDocumentOutline } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { IoMdCalendar } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import { ScrollArea } from "@/components/ui/scroll-area";
import AuthenticationModal from "./AuthenticationModal/AuthenticationModal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import useStoreUser from "@/hooks/useStoreUser";
import { usePathname } from "next/navigation";

function SideBarMenu() {
  const user = useStoreUser((state) => state.user);
  const pathname = usePathname()
  const resetStore = useStoreUser((state) => state.resetStore);

  function handleLogout() {
    resetStore();
  }

  const isModerationRoute = pathname.startsWith('/moderator')
  return (
    <Sheet>
      <SheetTrigger asChild>
        <IoMenu size={30} color="white" className="cursor-pointer" />
      </SheetTrigger>
      <SheetContent side="left" className="bg-[#FAFAFA] p-5 w-[90%]">
        <SheetHeader>
          <SheetTitle asChild>
            <Image
              src="/horizontal-logo-azul 3.svg"
              alt="User Avatar"
              width={180}
              height={90}
              className="w-40 mx-auto sm:mx-0 sm:w-60"
            />
          </SheetTitle>
        </SheetHeader>
        <div className="w-full mb-5 bg-white shadow-md shadow-black/40 rounded-lg p-4 flex gap-2">
          <Image
            src={user.userPhoto || "/default-avatar.webp"}
            alt="User Avatar"
            width={110}
            height={110}
            className="rounded-full sm:w-30"
          />
          {user.isAuthenticated && (
            <div className={user.isArtisan ? "sm:ml-auto mr-2" : "flex justify-center items-center ml-auto mr-auto"}>
              <h2 className="font-bold text-2xl text-midnight mb-1 line-clamp-2">
                {user.userName}
              </h2>
              {user.isArtisan && (
                <>
                  <p className="text-sm text-midnight font-semibold">@{user.artisanUserName}</p>
                  <Button asChild variant={"outline"} className="rounded-full">
                    <Link
                      href={`/artisan/${user.artisanUserName}`}
                      className="bg-[#FAFAFA] text-sakura border-sakura border-2 border-b-4 shadow-sakura hover:bg-sakura hover:text-white sm:w-42 mt-2 text-sm"
                    >
                      Ver meu perfil
                      <IoChevronForward />
                    </Link>
                  </Button>
                </>
              )}
            </div>
          )}
          {!user.isAuthenticated && (
            <div className="flex justify-center items-center pl-auto">
              <AuthenticationModal color="sakura" />
            </div>
          )}
        </div>
        <ScrollArea className="h-[50vh] sm:h-[70vh] w-full">
          {isModerationRoute ? (
            <>
              <div className="w-full mb-5 bg-white shadow-md shadow-black/40 rounded-lg p-4 flex items-center">
                <FaHome color="#ff8c94" size={30} />
                <p className="text-midnight font-bold text-lg sm:text-2xl ml-6 mr-auto">
                  Início
                </p>
              </div>
              <div className="w-full mb-5 bg-white shadow-md shadow-black/40 rounded-lg p-4 flex items-center">
                <IoPerson color="#ff8c94" size={30} />
                <p className="text-midnight font-bold text-lg sm:text-2xl ml-6">
                  Artesãos
                </p>
              </div>
              <div className="w-full mb-5 bg-white shadow-md shadow-black/40 rounded-lg p-4 flex items-center">
                <IoMdCalendar color="#ff8c94" size={30} />
                <p className="text-midnight font-bold text-lg sm:text-2xl ml-6">
                  Eventos
                </p>
              </div>
              <div className="w-full mb-5 bg-white shadow-md shadow-black/40 rounded-lg p-4 flex items-center">
                <CgDanger color="#ff8c94" size={30} />
                <p className="text-midnight font-bold text-lg sm:text-2xl ml-6">
                  Denúncias
                </p>
              </div>
              <div className="w-full mb-5 bg-white shadow-md shadow-black/40 rounded-lg p-4 flex items-center">
                <IoDocumentOutline color="#ff8c94" size={30} />
                <p className="text-midnight font-bold text-lg sm:text-2xl ml-6">
                  Documentação
                </p>
              </div>
              <div className="w-full mb-5 bg-white shadow-md shadow-black/40 rounded-lg p-4 flex items-center">
                <BsGear color="#ff8c94" size={30} />
                <p className="text-midnight font-bold text-lg sm:text-2xl ml-6">
                  Configurações
                </p>
              </div>
              <div className="w-full mb-5 bg-white shadow-md shadow-black/40 rounded-lg p-4 flex items-center">
                <IoMdHelpCircleOutline color="#ff8c94" size={30} />
                <p className="text-midnight font-bold text-lg sm:text-2xl ml-6">
                  Suporte e Ajuda
                </p>
              </div>

              <div className="w-full mb-5 bg-white shadow-md shadow-black/40 rounded-lg p-4 flex items-center">
                <TbLogout2 color="#ff8c94" size={30} />
                <p className="text-midnight font-bold text-lg sm:text-2xl ml-6">
                  Sair
                </p>
              </div>
            </>
          ) : (
            <>
              {user.isModerator && (
                <Link href="/moderator">
                  <div className="w-full cursor-pointer mb-5 bg-white shadow-md shadow-black/40 rounded-lg p-4 flex items-center">
                    <CgDanger color="#ff8c94" size={30} />
                    <p className="text-midnight font-bold text-lg sm:text-2xl ml-6 mr-auto">
                      Moderação
                    </p>
                    <IoChevronForward size={25} />
                  </div>
                </Link>
              )}
              <div className="w-full cursor-pointer mb-5 bg-white shadow-md shadow-black/40 rounded-lg p-4 flex items-center">
                <MdOutlineShoppingBag color="#ff8c94" size={30} />
                <p className="text-midnight font-bold text-lg sm:text-2xl ml-6 mr-auto">
                  Produtos
                </p>
                <IoChevronDownOutline size={25} />
              </div>
              {user.isArtisan && (
                <Link href={`/artisan/${user.artisanUserName}/add-product`}>
                  <div className="w-full cursor-pointer mb-5 bg-white shadow-md shadow-black/40 rounded-lg p-4 flex items-center">
                    <RxPlusCircled color="#ff8c94" size={30} />
                    <p className="text-midnight font-bold text-lg sm:text-2xl ml-6">
                      Adicionar Produto
                    </p>
                  </div>
                </Link>
              )}
              <div className="w-full cursor-pointer mb-5 bg-white shadow-md shadow-black/40 rounded-lg p-4 flex items-center">
                <FaRegHeart color="#ff8c94" size={30} />
                <p className="text-midnight font-bold text-lg sm:text-2xl ml-6">
                  Favoritos
                </p>
              </div>
              <div className="w-full cursor-pointer mb-5 bg-white shadow-md shadow-black/40 rounded-lg p-4 flex items-center">
                <BsGear color="#ff8c94" size={30} />
                <p className="text-midnight font-bold text-lg sm:text-2xl ml-6">
                  Configurações
                </p>
              </div>
              <div className="w-full cursor-pointer mb-5 bg-white shadow-md shadow-black/40 rounded-lg p-4 flex items-center">
                <IoMdHelpCircleOutline color="#ff8c94" size={30} />
                <p className="text-midnight font-bold text-lg sm:text-2xl ml-6">
                  Suporte e Ajuda
                </p>
              </div>
              {user.isAuthenticated && (
                <div onClick={handleLogout} className="w-full cursor-pointer mb-60 bg-white shadow-md shadow-black/40 rounded-lg p-4 flex items-center">
                  <TbLogout2 color="#ff8c94" size={30} />
                  <p className="text-midnight font-bold text-lg sm:text-2xl ml-6">
                    Sair
                  </p>
                </div>
              )}
            </>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet >
  );
}

export default SideBarMenu;
