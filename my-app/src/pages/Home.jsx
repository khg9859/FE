import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* ✅ 배경 동영상 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      >
        <source src="/videos/gym.mp4" type="video/mp4" />
        당신의 브라우저는 video 태그를 지원하지 않습니다.
      </video>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-8xl font-extrabold mb-8 tracking-tight drop-shadow-lg">
          HSU GYM
        </h1>

        <Link to="/reward-shop" className="bg-emerald-200 text-black font-semibold px-8 py-3 rounded-md shadow-md hover:bg-emerald-300 transition inline-block">
          나의 포인트 교환하러 가기
        </Link>
      </div>

      {/* 하단 고정 배너 */}
      <div className="absolute bottom-0 left-0 w-full bg-blue-700 text-white py-3 flex justify-around text-sm font-semibold">
        <span>오늘의 땀은 내일의 자신감이다.</span>
        <span>몸은 정직하다, 한 만큼 변한다.</span>
        <span>지금의 선택이 몸을 만든다.</span>
        <span>오늘 안 하면 내일도 안 한다.</span>
      </div>
    </div>
  );
}