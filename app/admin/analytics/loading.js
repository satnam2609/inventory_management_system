import LoadingProgess from "@/utils/Loading";

export default function Loading() {
  return (
    <div className="h-full grid place-items-center">
      <LoadingProgess color={"#005e30"} />
    </div>
  );
}
