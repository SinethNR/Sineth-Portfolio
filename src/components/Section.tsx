type SectionProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

/** Full-viewport-height section with the shared wide container. */
export default function Section({ id, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`relative flex min-h-screen flex-col justify-center py-24 sm:py-32 ${className}`}>
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-16">{children}</div>
    </section>
  );
}
