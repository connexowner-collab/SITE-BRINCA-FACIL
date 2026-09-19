import { Conversa } from "./Icones";
import { linkWhatsApp } from "@/lib/whatsapp";

type Props = {
  numero: string;
  mensagem: string;
  children?: React.ReactNode;
  className?: string;
};

/** Botão que abre o WhatsApp com mensagem pronta. Se o número ainda não foi configurado, não renderiza nada. */
export default function WhatsAppButton({ numero, mensagem, children = "Falar no WhatsApp", className = "btn btn-verde" }: Props) {
  if (!numero) return null;
  return (
    <a href={linkWhatsApp(numero, mensagem)} target="_blank" rel="noopener noreferrer" className={className}>
      <Conversa className="h-5 w-5" />
      {children}
    </a>
  );
}
