import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import NewPostModal from "./NewPostModal";
import { getApiUrl } from "../../config/api";

export default function RoutineTab({ darkMode, userId }) {
  const [routines, setRoutines] = useState([]); // API에서 가져온 루틴
  const [userPosts, setUserPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("routinePosts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [likedPosts, setLikedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("routineLikedPosts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // API에서 운동 루틴 가져오기
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await fetch(getApiUrl('/api/guide/workouts'));
        if (response.ok) {
          const data = await response.json();
          setRoutines(data);
        }
      } catch (error) {
        console.error('운동 루틴 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutines();
  }, []);

  // 사용자 게시글 저장
  useEffect(() => {
    localStorage.setItem("routinePosts", JSON.stringify(userPosts));
  }, [userPosts]);

  useEffect(() => {
    localStorage.setItem("routineLikedPosts", JSON.stringify(likedPosts));
  }, [likedPosts]);

  // API 루틴을 PostCard 형식으로 변환
  const convertRoutineToPost = (routine) => ({
    id: `routine-${routine.routine_id}`,
    title: routine.routine_name,
    content: routine.description,
    exercises: routine.exercises,
    tips: routine.tips,
    category: routine.category,
    difficulty: routine.difficulty,
    author: "헬스장 관리자",
    authorId: "admin",
    likes: routine.likes || 0,
    isOfficial: true, // 공식 루틴 표시
    createdAt: routine.created_at || new Date().toISOString()
  });

  // 필터링된 루틴
  const filteredRoutines = selectedCategory === "all"
    ? routines
    : routines.filter(r => r.category === selectedCategory);

  // 전체 게시글 = 공식 루틴 + 사용자 작성글
  const allPosts = [
    ...filteredRoutines.map(convertRoutineToPost),
    ...userPosts.filter(p => selectedCategory === "all" || p.category === selectedCategory)
  ].sort((a, b) => b.likes - a.likes);

  // 좋아요 기능
  const handleLike = (id) => {
    // 이미 좋아요를 눌렀는지 확인
    if (likedPosts.includes(id)) {
      alert("이미 좋아요를 누른 게시글입니다 👍");
      return;
    }

    // 공식 루틴 좋아요
    if (id.startsWith('routine-')) {
      setLikedPosts([...likedPosts, id]);
      // TODO: API로 좋아요 수 증가 요청
      return;
    }

    // 사용자 게시글 좋아요
    const post = userPosts.find(p => p.id === id);
    if (post && String(post.authorId) === String(userId)) {
      alert("본인이 작성한 게시글에는 좋아요를 누를 수 없습니다 😅");
      return;
    }

    const updated = userPosts.map((p) =>
      p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p
    );
    setUserPosts(updated);
    setLikedPosts([...likedPosts, id]);
  };

  // 글 삭제 (사용자 작성글만)
  const handleDelete = (id) => {
    if (id.startsWith('routine-')) {
      alert("공식 루틴은 삭제할 수 없습니다.");
      return;
    }
    const updated = userPosts.filter((p) => p.id !== id);
    setUserPosts(updated);
    setLikedPosts(likedPosts.filter((likedId) => likedId !== id));
  };

  // 새 글 추가
  const handleAddPost = (newPost) => {
    setUserPosts([{ ...newPost, id: Date.now() }, ...userPosts]);
  };

  const categories = ["all", "가슴", "등", "어깨", "하체", "팔"];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div>
      {/* 카테고리 필터 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : darkMode
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat === "all" ? "전체" : cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
        >
          새 루틴 작성
        </button>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
          darkMode ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {allPosts.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            onLike={() => handleLike(p.id)}
            onDelete={handleDelete}
            darkMode={darkMode}
            userId={userId}
            isLiked={likedPosts.includes(p.id)}
          />
        ))}
      </div>

      {showModal && (
        <NewPostModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddPost}
          darkMode={darkMode}
          type="routine"
          userId={userId}
        />
      )}
    </div>
  );
}
