import { useState } from "react";
import { ExternalLink, Globe, ShieldAlert } from "lucide-react";
import {
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialReveal,
  EditorialSection,
} from "@/components/editorial/EditorialPagePrimitives";

type Language = "en" | "es";

const content = {
  en: {
    language: "Language",
    home: "Home",
    title: "Terms of Use",
    draft: "DRAFT — PENDING UMD COUNSEL REVIEW",
    updated: "Last updated: Pending approval",
    intro:
      "These draft Terms describe the proposed rules for using the Development Ethics Toolkit. They are not final and must be reviewed and approved by University of Maryland counsel before publication as official terms.",
    sections: [
      {
        title: "1. Accounts and Account Security",
        body: "Each person should use only one account and provide accurate, current information. You are responsible for maintaining your account security and for activity conducted through your account. Notify the site administrators if you believe your account has been compromised.",
      },
      {
        title: "2. Acceptable Use",
        body: "Use the Toolkit lawfully and respectfully. Do not submit unlawful, misleading, infringing, abusive, or malicious material; attempt to access accounts or systems without authorization; disrupt the service; or misuse information about other users.",
      },
      {
        title: "3. Educational Purpose and Disclaimer",
        body: "The Toolkit is provided for educational and informational purposes only. Its content is not legal, professional, financial, or grant-funding advice. Content may contain errors or incomplete information. The availability of any resource or tool does not guarantee its accuracy, suitability, or outcome.",
      },
      {
        title: "4. Content You Submit",
        body: "You retain ownership of content you submit, subject to rights you have already granted to others. By submitting case studies, grant information, or other materials, you would grant the Toolkit and its authorized operators a non-exclusive, worldwide, royalty-free license to host, reproduce, display, and use that content to operate, maintain, improve, and promote the Toolkit. Submit only content you have the right to share. The Toolkit may review, restrict, or remove submitted content in accordance with its policies and applicable law. This proposed license requires legal review before use.",
      },
      {
        title: "5. Minimum Age",
        body: "The minimum age for creating an account has not yet been finalized. This section must be updated after the project team and University of Maryland counsel approve the applicable age requirement.",
      },
      {
        title: "6. Suspension and Termination",
        body: "The Toolkit may suspend or terminate access when reasonably necessary to protect users, maintain site security, address violations of these terms, or comply with applicable law. Final procedures and any appeal options are subject to review.",
      },
      {
        title: "7. Governing Law",
        body: "The governing-law and venue provisions must be confirmed by University of Maryland counsel before these terms are finalized.",
      },
      {
        title: "8. Changes to These Terms",
        body: "When these terms change, the site should publish a revised version with an updated effective date and provide notice of material changes through an appropriate website notice or account communication. The final notification process requires approval.",
      },
      {
        title: "9. Contact",
        body: "The project team must confirm the appropriate contact information before these terms are published.",
      },
    ],
    privacy: "Please also review the Privacy Policy.",
    privacyLink: "View Privacy Policy",
  },
  es: {
    language: "Idioma",
    home: "Inicio",
    title: "Términos de uso",
    draft: "BORRADOR — PENDIENTE DE REVISIÓN JURÍDICA DE UMD",
    updated: "Última actualización: Pendiente de aprobación",
    intro:
      "Este borrador describe las reglas propuestas para utilizar el Development Ethics Toolkit. No es definitivo y debe ser revisado y aprobado por el asesoramiento jurídico de la Universidad de Maryland antes de publicarse como términos oficiales.",
    sections: [
      {
        title: "1. Cuentas y seguridad",
        body: "Cada persona debe utilizar una sola cuenta y proporcionar información exacta y actualizada. Usted es responsable de proteger su cuenta y de la actividad realizada a través de ella. Notifique a los administradores si cree que su cuenta ha sido comprometida.",
      },
      {
        title: "2. Uso aceptable",
        body: "Utilice la plataforma de manera legal y respetuosa. No envíe material ilegal, engañoso, abusivo, malicioso o que infrinja derechos; no intente acceder a cuentas o sistemas sin autorización; no interrumpa el servicio ni haga un uso indebido de la información de otros usuarios.",
      },
      {
        title: "3. Finalidad educativa y descargo de responsabilidad",
        body: "La plataforma se ofrece únicamente con fines educativos e informativos. Su contenido no constituye asesoramiento jurídico, profesional, financiero ni sobre financiación de subvenciones. Puede haber errores o información incompleta. La disponibilidad de un recurso o herramienta no garantiza su exactitud, idoneidad ni resultados.",
      },
      {
        title: "4. Contenido enviado por usted",
        body: "Usted conserva la titularidad del contenido que envía, sujeto a los derechos que ya haya concedido a terceros. Al enviar estudios de caso, información sobre subvenciones u otros materiales, concedería a la plataforma y a sus operadores autorizados una licencia mundial, no exclusiva y libre de regalías para alojar, reproducir, mostrar y utilizar ese contenido con el fin de operar, mantener, mejorar y promover la plataforma. Envíe únicamente contenido que tenga derecho a compartir. La plataforma podrá revisar, restringir o eliminar contenido conforme a sus políticas y a la legislación aplicable. Esta licencia propuesta requiere revisión jurídica antes de utilizarse.",
      },
      {
        title: "5. Edad mínima",
        body: "La edad mínima para crear una cuenta aún no se ha definido. Esta sección debe actualizarse cuando el equipo del proyecto y el asesoramiento jurídico de la Universidad de Maryland aprueben el requisito correspondiente.",
      },
      {
        title: "6. Suspensión y cancelación",
        body: "La plataforma podrá suspender o cancelar el acceso cuando sea razonablemente necesario para proteger a los usuarios, mantener la seguridad, responder a infracciones o cumplir la legislación aplicable. Los procedimientos definitivos y las posibles opciones de apelación están pendientes de revisión.",
      },
      {
        title: "7. Legislación aplicable",
        body: "El asesoramiento jurídico de la Universidad de Maryland debe confirmar las disposiciones sobre legislación aplicable y jurisdicción antes de finalizar estos términos.",
      },
      {
        title: "8. Cambios en estos términos",
        body: "Cuando cambien estos términos, la plataforma deberá publicar una versión revisada con una fecha de entrada en vigor actualizada y avisar de los cambios importantes mediante un aviso en el sitio web o una comunicación a la cuenta. El proceso definitivo de notificación requiere aprobación.",
      },
      {
        title: "9. Contacto",
        body: "El equipo del proyecto debe confirmar la información de contacto adecuada antes de publicar estos términos.",
      },
    ],
    privacy: "Consulte también la Política de privacidad.",
    privacyLink: "Ver la Política de privacidad",
  },
};

export default function Terms() {
  const [language, setLanguage] = useState<Language>("en");
  const page = content[language];

  return (
    <div className="w-full bg-white text-[#202B20]">
      <EditorialPageHero
        compact
        backLink={{ label: page.home, to: "/" }}
        badges={[
          { label: "Legal & Governance", tone: "cream" },
          { label: page.updated, tone: "sage" },
        ]}
        title={
          language === "en" ? (
            <>
              Terms of{" "}
              <em className="font-normal italic text-[#E9E6B2]">Use</em>
            </>
          ) : (
            <>
              Términos de{" "}
              <em className="font-normal italic text-[#E9E6B2]">uso</em>
            </>
          )
        }
        subtitle={page.intro}
        aside={
          <div className="rounded-2xl border-[1.5px] border-[#E9E6B2]/75 bg-[#284B26]/90 p-5 text-white shadow-xl">
            <div className="flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#E9E6B2]">
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{page.language}</span>
            </div>
            <label className="mt-3 block">
              <span className="sr-only">{page.language}</span>
              <select
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as Language)
                }
                aria-label={page.language}
                className="w-full cursor-pointer rounded-xl border border-[#9AB887] bg-[#203D1F] px-3.5 py-2.5 text-sm font-medium text-white focus:border-[#E9E6B2] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2]/40"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </label>
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#D6CE8A]/50 bg-[#E9E6B2]/15 px-3.5 py-3 text-xs leading-relaxed text-[#E9E6B2]">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10px] font-medium uppercase tracking-wider">
                {page.draft}
              </span>
            </div>
          </div>
        }
      />

      <EditorialSection tone="sage" compact>
        <div className="mx-auto max-w-4xl space-y-5">
          {page.sections.map((section, idx) => (
            <EditorialReveal key={section.title} delay={Math.min(idx * 0.03, 0.2)}>
              <section className="rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-6 shadow-xs sm:p-7">
                <h2
                  className="text-xl font-semibold tracking-tight text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#394838] sm:text-base">
                  {section.body}
                </p>
              </section>
            </EditorialReveal>
          ))}

          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border-[1.5px] border-[#94B985] bg-[#F6F4D8] p-6 sm:flex-row sm:items-center">
            <p className="text-sm font-medium text-[#202B20]">{page.privacy}</p>
            <a
              href="/Privacy_Statement.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3F673C] to-[#187347] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:brightness-110"
            >
              <span>{page.privacyLink}</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </EditorialSection>
    </div>
  );
}
