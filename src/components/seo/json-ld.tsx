type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Injects JSON-LD for search engines. Safe for Server Components. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
