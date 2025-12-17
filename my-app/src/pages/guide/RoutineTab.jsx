import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import NewPostModal from "./NewPostModal";
import { getApiUrl } from "../../config/api";

export default function RoutineTab({ darkMode, userId }) {
  const [routines, setRoutines] = useState([]); // API에서 가져온 공식 루틴
  const [userPosts, setUserPosts] = useState([]); // API에서 가져온 사용자 게시글
  const [likedPosts, setLikedPosts] = useState([]); // 사용자가 좋아요한 게시글 ID 목록
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // 데이터 로드
  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 공식 루틴 가져오기
      const routinesRes = await fetch(getApiUrl('/api/guide/workouts'));
      if (routinesRes.ok) {
        const routinesData = await routinesRes.json();
        setRoutines(routinesData);
      }

      // 사용자 게시글 가져오기
      const postsRes = await fetch(getApiUrl('/api/guide/user-workouts'));
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setUserPosts(postsData);
      }

      // 좋아요한 게시글 목록 가져오기
      if (userId) {
        const likedRes = await fetch(getApiUrl(`/api/guide/user-posts/liked/${userId}`));
        if (likedRes.ok) {
          const likedData = await likedRes.json();
          setLikedPosts(likedData);
        }
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

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
    isOfficial: true,
    createdAt: routine.created_at || new Date().toISOString()
  });

  // 사용자 게시글을 PostCard 형식으로 변환
  const convertUserPostToPost = (post) => ({
    id: post.post_id,
    title: post.title,
    content: post.content,
    exercises: post.data?.exercises,
    category: post.category,
    author: post.author_name,
    authorId: post.member_id,
    likes: post.likes || 0,
    isOfficial: false,
    createdAt: post.created_at
  });

  // 필터링된 게시글
  const filteredRoutines = selectedCategory === "all"
    ? routines
    : routines.filter(r => r.category === selectedCategory);

  const filteredUserPosts = selectedCategory === "all"
    ? userPosts
    : userPosts.filter(p => p.category === selectedCategory);

  // 전체 게시글 = 공식 루틴 + 사용자 작성글
  const allPosts = [
    ...filteredRoutines.map(convertRoutineToPost),
    ...filteredUserPosts.map(convertUserPostToPost)
  ].sort((a, b) => b.likes - a.likes);

  // 좋아요 기능
  const handleLike = async (id) => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 공식 루틴 좋아요 (아직 API 없음)
    if (typeof id === 'string' && id.startsWith('routine-')) {
      if (likedPosts.includes(id)) {
        alert("이미 좋아요를 누른 게시글입니다 👍");
        return;
      }
      setLikedPosts([...likedPosts, id]);
      return;
    }

    // 사용자 게시글 좋아요
    const post = userPosts.find(p => p.post_id === id);
    if (!post) return;

    if (post.member_id === userId) {
      alert("본인이 작성한 게시글에는 좋아요를 누를 수 없습니다 😅");
      return;
    }

    if (likedPosts.includes(id)) {
      alert("이미 좋아요를 누른 게시글입니다 👍");
      return;
    }

    try {
      const response = await fetch(getApiUrl(`/api/guide/user-posts/${id}/like`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: userId })
      });

      if (response.ok) {
        await fetchData(); // 데이터 새로고침
      } else {
        const error = await response.json();
        alert(error.error || '좋아요 추가 실패');
      }
    } catch (error) {
      console.error('좋아요 추가 실패:', error);
      alert('좋아요 추가에 실패했습니다.');
    }
  };

  // 글 삭제
  const handleDelete = async (id) => {
    if (typeof id === 'string' && id.startsWith('routine-')) {
      alert("공식 루틴은 삭제할 수 없습니다.");
      return;
    }

    try {
      const response = await fetch(getApiUrl(`/api/guide/user-posts/${id}?member_id=${userId}`), {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchData(); // 데이터 새로고침
        alert('게시글이 삭제되었습니다.');
      } else {
        const error = await response.json();
        alert(error.error || '삭제 실패');
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  // 새 글 추가
  const handleAddPost = async (newPost) => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/guide/user-posts'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_id: userId,
          post_type: 'workout',
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          data: { exercises: newPost.exercises }
        })
      });

      if (response.ok) {
        await fetchData(); // 데이터 새로고침
        alert('게시글이 작성되었습니다!');
      } else {
        const error = await response.json();
        alert(error.error || '작성 실패');
      }
    } catch (error) {
      console.error('작성 실패:', error);
      alert('게시글 작성에 실패했습니다.');
    }
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
              className={`px-4 py-2 rounded-md font-semibold transition ${selectedCategory === cat
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
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${darkMode ? "text-gray-100" : "text-gray-800"
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
