import { useParams } from "react-router-dom";
import Derivatives from "./Derivatives";

export default function DerivativeSolverPage() {
  const { type } = useParams();

  return <Derivatives derivativeType={type} />;
}