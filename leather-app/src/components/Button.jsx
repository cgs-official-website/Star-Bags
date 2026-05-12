export const Button = () => {
  return (
    <>
        <div className="m-3 d-grid">
            <button className="btn " type="button" style={{backgroundColor:"var(--levender)",color:"var(--white-color)"}}>Send Message</button>
        </div>
        <div>
          <button className="filter" type="button" style={{backgroundColor:"var(--levender)",color:"var(--white-color)"}}>Filters</button>
        </div>
      
    </>
  )
}
