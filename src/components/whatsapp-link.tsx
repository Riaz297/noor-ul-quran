import { phoneFor } from "@/lib/draft-students";
import { whatsappUrl } from "@/lib/whatsapp";

export function WhatsAppLink({
  name,
  text,
  openLabel,
  missingLabel,
}: {
  name: string;
  text: string;
  openLabel: string;
  missingLabel: string;
}) {
  const href = whatsappUrl(phoneFor(name), text);
  if (!href) {
    return <div className="note">{missingLabel}</div>;
  }
  return (
    <div className="note">
      <a href={href} target="_blank" rel="noreferrer">
        {openLabel}
      </a>
    </div>
  );
}
