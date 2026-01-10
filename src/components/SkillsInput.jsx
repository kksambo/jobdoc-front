export default function SkillsInput({ skills, onChange }) {
  const addSkill = () => onChange([...skills, ""]);
  const updateSkill = (i, v) => {
    const copy = [...skills];
    copy[i] = v;
    onChange(copy);
  };

  return (
    <>
      {skills.map((s, i) => (
        <input
          key={i}
          placeholder={`Skill ${i + 1}`}
          value={s}
          onChange={e => updateSkill(i, e.target.value)}
        />
      ))}
      <button type="button" onClick={addSkill}>
        + Add Skill
      </button>
    </>
  );
}
