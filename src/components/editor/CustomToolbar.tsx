export default function CustomToolbar() {
  return (
    <div
      id="toolbar"
      style={{ width: '400px', margin: '0 auto', marginBottom: '-1px' }}
    >
      <select className="ql-header" defaultValue={''}>
        <option value="1"></option>
        <option value="2"></option>
        <option selected></option>
      </select>
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <select className="ql-color">
        <option value="red"></option>
        <option value="green"></option>
        <option value="blue"></option>
        <option value="orange"></option>
        <option value="violet"></option>
        <option value="#d0d1d2"></option>
        <option selected></option>
      </select>
      <button className="ql-clean"></button>
      <button className="ql-insertStar" style={{ lineHeight: '16px' }}>
        ★
      </button>
    </div>
  )
}
