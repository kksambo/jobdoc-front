export default function TemplateSelector({ selected, onChange }) {
  const templates = ["cv_template1.html", "cv_template2.html"];

  return (
    <>
      <div className="section-title">Choose Template</div>
      <div className="template-grid">
        {templates.map(t => (
          <div
            key={t}
            className={`template-btn ${selected === t ? "active" : ""}`}
            onClick={() => onChange(t)}
          >
            {t.replace(".html", "").replace("_", " ").toUpperCase()}
          </div>
        ))}
      </div>
    </>
  );
}
