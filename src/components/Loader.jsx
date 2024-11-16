import { BeatLoader } from "react-spinners"

const Loader = ({ loading }) => {
  return (
    <BeatLoader
      loading={loading}
      size={24}
      color="#1ce1da"
      cssOverride={{
        display: "flex",
        backgroundColor: "rgba(0,0,0,0.7)",
        position: "fixed",
        inset: 0,
        justifyContent: "center",
        alignItems: "center"
      }}
    />
  )
}

export default Loader
