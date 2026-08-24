import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { getWorkoutDay, isWeekdayId } from "../lib/week";
import { SessionApp } from "../ui/App";

export const Route = createFileRoute("/okt/$dayId")({
  head: ({ params }) => {
    const day = isWeekdayId(params.dayId) ? getWorkoutDay(params.dayId) : undefined;
    const title = day ? `${day.weekdayLabel} – ${day.title}` : "ØKT";
    return {
      meta: [
        { title: `${title} | ØKT` },
        {
          name: "description",
          content: day
            ? `${day.weekdayLabel}: ${day.title}. Start økten med mastertimer og hvileklokke.`
            : "Treningsøkt",
        },
        { name: "theme-color", content: "#1C1A14" },
      ],
    };
  },
  component: OktPage,
});

function OktPage() {
  const { dayId } = Route.useParams();
  const navigate = useNavigate();

  if (!isWeekdayId(dayId)) {
    return <Navigate to="/" />;
  }

  return (
    <SessionApp
      dayId={dayId}
      onLeave={() => {
        void navigate({ to: "/" });
      }}
    />
  );
}
