export function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="#1B5E4A" />
      <path
        d="M24 8l3.2 8.8H36l-7.2 5.2 2.8 8.8L24 26.4 16.4 30.8l2.8-8.8L12 16.8h8.8Z"
        fill="none"
        stroke="#C4A35A"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function strokeIcon(path: string) {
  return (
    <svg className="home-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function IconPeople() {
  return (
    <svg className="home-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 18c.6-3 2.7-4.5 5.5-4.5s4.9 1.5 5.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="9" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M14.6 18c.4-2.2 1.8-3.4 3.8-3.4 1.2 0 2.2.4 2.9 1.1" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function IconCheck() {
  return (
    <svg className="home-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="3.5" width="16" height="17" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 12.2 10.5 15 16 9" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconBook() {
  return (
    <svg className="home-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5.5h6.5A3.5 3.5 0 0 1 15 9v10H8.2A3.2 3.2 0 0 0 5 15.8V5.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M19 5.5h-6.5A3.5 3.5 0 0 0 9 9v10h6.8A3.2 3.2 0 0 0 19 15.8V5.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function IconHome() {
  return (
    <svg className="home-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 11 8-7 8 7v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10 22v-7h4v7" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function IconComment() {
  return strokeIcon("M5 6.5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4 3.2V17.5H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z");
}

export function IconReport() {
  return (
    <svg className="home-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4.5h8l4 4V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15 4.5V9h4M8 13h8M8 16.5h5" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function IconParents() {
  return <IconPeople />;
}

export function IconPrayer() {
  return (
    <svg className="home-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v4M8 8h8M7 20c1.4-3.5 3-5.5 5-5.5s3.6 2 5 5.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="13" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
