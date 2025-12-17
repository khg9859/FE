import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import NewPostModal from "./NewPostModal";
import { getApiUrl } from "../../config/api";

export default function DietTab({ darkMode, userId }) {
  const [diets, setDiets] = useState([]); // API에서 가져온 식단
  const [userPosts, setUserPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("dietPosts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [likedPosts, setLikedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("dietLikedPosts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // API에서 식단 추천 가져오기
  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const response = await fetch(getApiUrl('/api/guide/diets'));
        if (response.ok) {
          const data = await response.json();
          setDiets(data);
        }
      } catch (error) {
        console.error('식단 추천 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiets();
  }, []);

  // 사용자 게시글 저장
  useEffect(() => {
    localStorage.setItem("dietPosts", JSON.stringify(userPosts));
  }, [userPosts]);

  useEffect(() => {
    localStorage.setItem("dietLikedPosts", JSON.stringify(likedPosts));
  }, [likedPosts]);

  // API 식단을 PostCard 형식으로 변환
  const convertDietToPost = (diet) => ({
    id: `diet-${diet.diet_id}`,
    title: diet.diet_name,
    content: diet.description,
    meals: diet.meals,
    calories: diet.calories,
    tips: diet.tips,
    category: diet.category,
    author: "헬스장 관리자",
    authorId: "admin",
    likes: diet.likes || 0,
    isOfficial: true, // 공식 식단 표시
    createdAt: diet.created_at || new Date().toISOString()
  });

  // 필터링된 식단
  const filteredDiets = selectedCategory === "all"
    ? diets
    : diets.filter(d => d.category === selectedCategory);

  // 전체 게시글 = 공식 식단 + 사용자 작성글
  const allPosts = [
    ...filteredDiets.map(convertDietToPost),
    ...userPosts.filter(p => selectedCategory === "all" || p.category === selectedCategory)
  ].sort((a, b) => b.likes - a.likes);

  // 좋아요 기능
  const handleLike = (id) => {
    // 이미 좋아요를 눌렀는지 확인
    if (likedPosts.includes(id)) {
      alert("이미 좋아요를 누른 게시글입니다 👍");
      return;
    }

    // 공식 식단 좋아요
    if (id.startsWith('diet-')) {
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
    if (id.startsWith('diet-')) {
      alert("공식 식단은 삭제할 수 없습니다.");
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

  const categories = ["all", "다이어트", "벌크업", "유지", "건강식"];

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
          새 식단 작성
        </button>
      </div>

      {/* 게시글 카드 목록 */}
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

      {/* 새 글 작성 모달 */}
      {showModal && (
        <NewPostModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddPost}
          darkMode={darkMode}
          type="diet"
          userId={userId}
        />
      )}
    </div>
  );
}
