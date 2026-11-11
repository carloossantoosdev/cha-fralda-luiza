import { eventDetails, hostWhatsappLink } from "../lib/event";
import type { RsvpResult } from "../lib/types";

type ThankYouCardProps = {
  result: RsvpResult;
};

export function ThankYouCard({ result }: ThankYouCardProps) {
  const firstName = result.guestName.trim().split(/\s+/)[0];
  const whatsapp = hostWhatsappLink("Olá! Confirmei presença no chá da Luiza.");

  return (
    <section
      id="rsvp"
      className="flex h-full min-h-full w-full flex-1 flex-col text-center"
      aria-labelledby="obrigado-titulo"
    >
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-[#e58b9a]">
          {result.alreadyConfirmed
            ? "Presença já confirmada"
            : "Presença confirmada"}
        </p>
        <h2 id="obrigado-titulo" className="mt-6 font-display text-4xl text-[#e58b9a]">
          Que alegria, {firstName}
        </h2>
      </div>

      <div className="min-h-40 flex-1" aria-hidden />

      <div className="mb-4 flex w-full flex-col items-center px-2">
          <p className="text-sm leading-relaxed text-[#e58b9a]">
            {result.alreadyConfirmed
              ? "Este nome e telefone já estavam na lista. A confirmação continua valendo uma vez só."
              : "A Luiza e os pais agradecem. O seu lugar no chá de 5 de dezembro já está guardado."}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[#e58b9a]">
            O tamanho da fralda está em Sugestões de presentes.
          </p>
        </div>

        {whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex text-sm font-medium text-[#e58b9a] underline decoration-[#f3c3ce] underline-offset-4"
          >
            Falar com {eventDetails.hosts} no WhatsApp
          </a>
        )}
    </section>
  );
}
