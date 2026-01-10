export default function DutiesInput({ duties, onChange }) {
  const addDuty = () => onChange([...duties, ""]);
  const updateDuty = (i, v) => {
    const copy = [...duties];
    copy[i] = v;
    onChange(copy);
  };

  return (
    <>
      {duties.map((d, i) => (
        <textarea
          key={i}
          placeholder={`Duty ${i + 1}`}
          value={d}
          onChange={e => updateDuty(i, e.target.value)}
        />
      ))}
      <button type="button" onClick={addDuty}>
        + Add Duty
      </button>
    </>
  );
}
