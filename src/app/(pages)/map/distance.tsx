
type DistanceProps = {
  leg: google.maps.DirectionsLeg;
};

export default function Distance({ leg }: DistanceProps) {
  if (!leg.distance || !leg.duration) return null;


  return (
    <div>
      <p>
        Total distance = <span className="highlight">{leg.distance.text}</span> &nbsp;|&nbsp;{" "} Time = {" "}
        <span className="highlight">{leg.duration.text}</span> 
      </p>
    </div>
  );
}