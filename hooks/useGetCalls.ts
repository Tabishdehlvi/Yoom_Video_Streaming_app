import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";

export const useGetCalls = () => {
  const [callList, setCallList] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const client = useStreamVideoClient();
  const { user } = useUser();

  useEffect(() => {
    const loadCallsList = async () => {
      if (!client || !user?.id) return;
      setIsLoading(true);
      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          },
        });

        setCallList(calls);
      } catch (error) {
        console.log("ERROR", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCallsList();
  }, [client, user?.id]);

  const now = new Date();

  const previusCalls = callList?.filter(
    ({ state: { startsAt, endedAt } }: Call) => {
      return (startsAt && new Date(startsAt) < now) || !!endedAt;
    }
  );

  const upcomingCalls = callList.filter(({ state: { startsAt } }: Call) => {
    return startsAt && new Date(startsAt) > now;
  });

  return {
    previusCalls,
    upcomingCalls,
    callRecordings: callList,
    isLoading,
  };
};
