import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('로그아웃되었습니다.');
    navigate('/');
  };

  return (
    <nav className="bg-black text-white flex justify-between items-center px-10 py-4 text-lg shadow-md">
      {/* 왼쪽: 로고 + 홈버튼 */}
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-emerald-300 transition">
          HSU GYM
        </Link>
        <Link to="/" className="hover:text-gray-400 transition">홈페이지</Link>
      </div>

      {/* 오른쪽: 메뉴 */}
      <div className="flex items-center space-x-10 font-medium">
        <Link to="/notice" className="hover:text-gray-400 transition">공지사항</Link>
        <Link to="/class" className="hover:text-gray-400 transition">수업</Link>
        <Link to="/mentoring" className="hover:text-gray-400 transition">멘토링 신청</Link>
        <Link to="/guide" className="hover:text-gray-400 transition">헬스 가이드</Link>
        <Link to="/incentive" className="hover:text-gray-400 transition">포인트/퀘스트</Link>
        <Link to="/mypage" className="hover:text-gray-400 transition">마이페이지</Link>

        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span className="text-emerald-300">{user?.name}님</span>
            <span className="text-yellow-400">{user?.mypoints}P</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
          >
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
}