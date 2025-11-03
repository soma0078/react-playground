export default function CustomToolbar() {
  return (
    <div
      id="customToolbar"
      style={{
        width: '400px',
        margin: '0 auto',
        marginBottom: '-1px',
        border: 0,
        backgroundColor: 'var(--color-gray-100)'
      }}
    >
      <select className="ql-header" defaultValue={''}>
        <option value="1" />
        <option value="2" />
        <option selected />
      </select>
      <div>
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
      </div>

      <select className="ql-color">
        <option value="red" />
        <option value="green" />
        <option value="blue" />
        <option value="orange" />
        <option value="violet" />
        <option value="#d0d1d2" />
        <option selected />
      </select>
      <select className="ql-background">
        <option value="red" />
        <option value="green" />
        <option value="blue" />
        <option value="orange" />
        <option value="violet" />
        <option value="#d0d1d2" />
        <option selected />
      </select>
      <button className="ql-blockquote" />
      <button className="ql-code-block" />
      <select className="ql-align">
        <option selected />
        <option value="center" />
        <option value="right" />
        <option value="justify" />
      </select>
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button className="ql-indent" value="-1" />
      <button className="ql-indent" value="+1" />
      <button className="ql-image" />
      <button className="ql-video" />
      <button className="ql-link" />
      <button className="ql-formula" />
      <button className="ql-insertStar" style={{ lineHeight: '16px' }}>
        ★
      </button>
    </div>
  )
}
