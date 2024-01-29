import FlexBetween from "@/utils/FlexBetween";
import Headers from "@/utils/Header";

export default async function AdminPage() {
  return (
    <div className="w-full h-full">
      <FlexBetween className="px-4 py-2">
        <Headers
          text={"Dashboard"}
          description={"Fully interactive dashboard ..."}
        />
      </FlexBetween>
    </div>
  );
}
