export default function Reels({reels}) {

  return (reels.map((row, r) => {
    return (
      <div key={r}>
        {row.map((symbol,c)=> (
          <span key={c}>{symbol}</span>
        ))}
      </div>
    )
  }))
}

//export default Reels;