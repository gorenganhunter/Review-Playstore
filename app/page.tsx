"use client";
import Draggable from "react-draggable";
import { useRef } from "react";

export default function Home() {
  const nodeRef = useRef(null);

  return (
    <>
      <div className="flex justify-center px-5 items-center min-h-screen text-center flex-col gap-6">
        <h1 className="text-4xl lg:text-5xl font-bold text-shadow-sm/30">
          TITLE HERE
        </h1>
        <p className="max-w-xl text-lg opacity-70 -mt-2">
          Analisis otomatis kualitas aplikasi berdasarkan ribuan review
          Playstore
        </p>

        <input
          id="url-input"
          placeholder="Masukkan URL Aplikasi"
          className="bg-white rounded-full px-6 py-4 text-xl w-full max-w-2xl shadow-sm/20"
        />

        <div className="flex justify-center w-full px-5 flex-col md:flex-row gap-4 mt-2">
          <button className="w-full md:w-fit bg-[#F3DBC4] hover:bg-[#F3DBC4]/60 cursor-pointer rounded-md text-lg px-4 py-2 font-semibold">
            Cari Tahu Review
          </button>
          <button className="bg-[#F3DBC4] hover:bg-[#F3DBC4]/60 cursor-pointer rounded-md text-lg px-4 py-2 font-semibold">
            About Us
          </button>
        </div>
      </div>

      {/* Floating draggable card */}
      <Draggable nodeRef={nodeRef}>
        <div
          ref={nodeRef}
          className="fixed bottom-5 right-5 bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-5 w-100 cursor-move"
        >
          <p className="text-sm opacity-80">
            ⭐ <b>4.6</b> — 70% positif | 20% netral | 10% negatif
          </p>
          <p className="text-sm mt-2 opacity-70 italic">
            “game ini sangat seru dan banyak map atau game tapi mohon diperbaiki
            lagi untuk pembuatnya jadi tidak pakai kuota karena jika tidak ada
            kuota maka aku diskon sekian dan terimakasih”
          </p>
        </div>
      </Draggable>
    </>
  );
}
