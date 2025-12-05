"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

interface ReviewItem {
  priority: string;
  area: string;
  description: string;
  reason: string;
}

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ReviewLayout() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const appId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("appId")
      : null;

  useEffect(() => {
    if (!appId) {
      setError("Missing appId in URL");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/analyze?appId=${appId}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json.error || "Failed to fetch");

        const raw = json.result;

        setData({
          summary: raw.summary_overall,
          positiveArr: raw.positive_points,
          criticArr: raw.negative_points,
          positive: raw.positive_points?.join("\n• "),
          critic: raw.negative_points?.join("\n• "),
          sentiment: raw.overall_sentiment,
          reviews: raw.action_items_for_developer || [],
          appName: raw.appName,
          icon: raw.icon,
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-[#4B3A28]">
        Loading analysis...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );

  const {
    appName,
    summary,
    positive,
    critic,
    reviews,
    positiveArr,
    criticArr,
    icon,
  } = data;

  const sentimentPieData = {
    labels: ["Positive", "Negative", "Mixed"],
    datasets: [
      {
        data: [positiveArr.length, criticArr.length, 3],
        backgroundColor: ["#A1BC98", "#F08787", "#E8D3C2"],
        borderWidth: 2,
        borderColor: "#FFF8F0",
      },
    ],
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-6 py-10 gap-5 text-[#4B3A28]">
      <nav className="w-full max-w-7xl flex justify-center">
        <Link
          href="/"
          className="text-[#4B3A28] font-extrabold text-3xl py-2 px-4 rounded-lg transition"
        >
          PLAYREVIEW
        </Link>
      </nav>

      <div className="flex flex-col items-center gap-4 w-full max-w-7xl">
        <img
          src={`https://images.weserv.nl/?url=${encodeURIComponent(icon)}`}
          alt={appName}
          className="rounded-2xl mb-2 border border-[#E8D3C2] w-32 h-32 object-contain"
        />
        <h1 className="text-3xl font-bold text-center">{appName}</h1>
        <div className="w-24 h-1 mb-4 rounded-full bg-[#C7A17A]"></div>
      </div>

      <div className="w-full max-w-7xl flex flex-col md:flex-row items-start gap-5">
        <div className="w-full rounded-3xl shadow-sm p-8 bg-[#FFF8F0] border border-[#E8D3C2]">
          <p className="text-lg md:text-xl leading-relaxed opacity-90">
            {summary}
          </p>
        </div>
      </div>

      <div className="w-full max-w-7xl flex flex-col md:flex-row-reverse gap-6 mb-5">
        <div className="max-w-7xl rounded-3xl shadow-sm p-8 bg-[#FFF8F0] border border-[#E8D3C2]">
          <h2 className="text-2xl font-bold mb-4">Sentiment Distribution</h2>
          <div className="max-w-sm mx-auto p-4 bg-[#FFF8F0] rounded-xl">
            <Pie data={sentimentPieData} />
          </div>
        </div>
        <div className="min-h-full w-full gap-6 flex flex-col">
          <div className="border-l-4 border-[#A1BC98] p-6 rounded-xl h-full shadow-sm bg-[#FFF8F0] hover:shadow-lg transition">
            <h2 className="text-xl font-bold mb-2">Positive</h2>
            <p className="whitespace-pre-line opacity-90 leading-relaxed">
              • {positive}
            </p>
          </div>
          <div className="border-l-4 border-[#F08787] p-6 rounded-xl h-full shadow-md bg-[#FFF8F0] hover:shadow-lg transition">
            <h2 className="text-xl font-bold mb-2">Critic</h2>
            <p className="whitespace-pre-line opacity-90 leading-relaxed">
              • {critic}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl flex flex-col gap-3">
        <h2 className="text-3xl font-bold">Action Items for Developer</h2>
        <div className="w-24 h-1 mb-4 rounded-full bg-[#C7A17A]"></div>
        {reviews?.map((item: ReviewItem, idx: number) => (
          <div
            key={idx}
            className="p-6 bg-[#FFF8F0] border border-[#E8D3C2] rounded-xl shadow-sm hover:shadow-lg transition"
          >
            <p className="font-bold text-lg">
              {item.priority.toUpperCase()} — {item.area}
            </p>
            <p className="mt-1 opacity-90">{item.description}</p>
            <p className="mt-1 text-sm opacity-60">Reason: {item.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
