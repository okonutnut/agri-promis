import SkeletonLoading from "@/components/custom/layout/skeleton-loading";
import { useSelectActivityLogsByUserIDHook } from "@/components/hooks";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

type RecentActivitiesProps = {
  user_id: string;
};
export function FTRecentActivities({ user_id }: RecentActivitiesProps) {
  const { data, isLoading } = useSelectActivityLogsByUserIDHook(
    user_id as string
  );

  return (
    <>
      <Label className="mb-1">Recent Activities:</Label>
      {isLoading && <SkeletonLoading />}
      {data && (
        <table className="w-full">
          <tbody className="border rounded-md">
            {data.map((activity) => (
              <tr key={activity.id} className="border-b hover:bg-gray-100">
                <td className="w-full text-sm flex justify-between items-center p-2">
                  <span>{activity.code}</span>
                  <span>{format(new Date(activity.created_at), "PPp")}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
