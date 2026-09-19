import Image from "next/image";
import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <Image src="/mascote.png" alt="" width={160} height={160} className="mx-auto h-40 w-40 animate-float" />
      <h1 className="mt-4 text-5xl font-bold">Ops, página não encontrada</h1>
      <p className="mt-3 text-lg">O brinquedo que você procura pode ter saído de cena. Que tal ver as outras opções?</p>
      <Link href="/#catalogo" className="btn btn-vermelho mt-6">Ver brinquedos</Link>
    </div>
  );
}
