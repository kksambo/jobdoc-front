import { useEffect, useState } from "react";

export default function CVPreview({ template, cv }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    fetch("https://jobdoc-generator.onrender.com/api/cv/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template, cv }),
    })
      .then((res) => res.text())
      .then(setHtml);
  }, [template, cv]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
